import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import crypto from "crypto";

// Verify Xendit webhook signature
function verifyXenditCallback(
  requestBody: string,
  callbackToken: string,
  xenditHeader: string
) {
  const hmac = crypto.createHmac("sha256", callbackToken);
  hmac.update(requestBody);
  const generatedToken = hmac.digest("hex");

  return generatedToken === xenditHeader;
}

// POST /api/webhooks/xendit - Handle Xendit webhook callbacks
export async function POST(request: NextRequest) {
  try {
    // Get the raw request body as a string
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // Get Xendit callback token from environment variables
    const callbackToken = process.env.XENDIT_CALLBACK_TOKEN;

    if (!callbackToken) {
      console.error("XENDIT_CALLBACK_TOKEN is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get Xendit callback signature from headers
    const xenditHeader = request.headers.get("x-callback-token");

    if (!xenditHeader) {
      console.error("Missing Xendit callback signature");
      return NextResponse.json(
        { error: "Missing callback signature" },
        { status: 401 }
      );
    }

    // Verify callback signature
    const isValid = verifyXenditCallback(rawBody, callbackToken, xenditHeader);

    if (!isValid) {
      console.error("Invalid Xendit callback signature");
      return NextResponse.json(
        { error: "Invalid callback signature" },
        { status: 401 }
      );
    }

    // Process the webhook based on event type
    const { event, data } = body;

    // Handle both old and new event names
    if (
      event === "invoice.paid" ||
      event === "invoice.settled" ||
      event === "payment.succeeded" ||
      event === "invoice.succeeded"
    ) {
      // Find payment by external ID or invoice ID
      const payment = await db.payment.findFirst({
        where: {
          OR: [
            { externalId: data.externalId || data.external_id },
            { invoiceId: data.id },
          ],
        },
        include: { subscription: true },
      });

      if (!payment) {
        console.error("Payment not found for invoice:", data.id);
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 }
        );
      }

      // Prepare metadata
      let newMetadata: any = { xenditCallback: data };
      if (payment.metadata) {
        newMetadata = {
          ...JSON.parse(JSON.stringify(payment.metadata)),
          xenditCallback: data,
        };
      }

      // Update payment status to COMPLETED
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          paymentDate: new Date(),
          metadata: newMetadata,
        },
      });

      // If payment is for a subscription, update user's subscription
      if (payment.subscriptionId && payment.subscription) {
        await db.user.update({
          where: { id: payment.userId },
          data: {
            currentPlan: payment.subscription.plan,
            subscriptionExpiry: payment.subscription.endDate,
          },
        });

        // Update subscription status to active
        await db.subscription.update({
          where: { id: payment.subscriptionId },
          data: { status: "active" },
        });
      }

      return NextResponse.json({ success: true });
    } else if (
      event === "invoice.expired" ||
      event === "payment.expired" ||
      event === "invoice.failed"
    ) {
      // Find payment by external ID or invoice ID
      const payment = await db.payment.findFirst({
        where: {
          OR: [
            { externalId: data.externalId || data.external_id },
            { invoiceId: data.id },
          ],
        },
      });

      if (!payment) {
        console.error("Payment not found for invoice:", data.id);
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 }
        );
      }

      // Prepare metadata
      let newMetadata: any = { xenditCallback: data };
      if (payment.metadata) {
        newMetadata = {
          ...JSON.parse(JSON.stringify(payment.metadata)),
          xenditCallback: data,
        };
      }

      // Update payment status to EXPIRED
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.EXPIRED,
          metadata: newMetadata,
        },
      });

      return NextResponse.json({ success: true });
    }

    // For other events, just acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Xendit webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
