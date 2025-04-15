import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserPaymentHistory } from "@/lib/subscription";
import { getInvoiceStatus } from "@/lib/xendit";
import { db } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

// GET /api/payments - Get user's payment history
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await getUserPaymentHistory(session.user.id);

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error getting payments:", error);
    return NextResponse.json(
      { error: "Failed to get payments" },
      { status: 500 }
    );
  }
}

// POST /api/payments/check/:id - Check payment status
export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const paymentId = resolvedParams.id;

    // Get payment from database
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Check if payment belongs to user
    if (payment.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If payment is already completed, return success
    if (payment.status === PaymentStatus.COMPLETED) {
      return NextResponse.json({ status: PaymentStatus.COMPLETED });
    }

    // If payment has Xendit invoice ID, check status
    if (payment.invoiceId) {
      const invoiceResult = await getInvoiceStatus(payment.invoiceId);

      if (invoiceResult.success && invoiceResult.data) {
        const xenditStatus = invoiceResult.data.status;

        // Map Xendit status to our PaymentStatus
        let newStatus: string = payment.status;

        if (xenditStatus === "PAID" || xenditStatus === "SETTLED") {
          newStatus = "COMPLETED";
        } else if (xenditStatus === "EXPIRED") {
          newStatus = "EXPIRED";
        } else if (xenditStatus === "PENDING") {
          newStatus = "PENDING";
        }

        // Update payment status if changed
        if (newStatus !== payment.status) {
          await db.payment.update({
            where: { id: payment.id },
            data: {
              status: newStatus as PaymentStatus,
              paymentDate: newStatus === "COMPLETED" ? new Date() : null,
            },
          });

          // If payment is completed, update user's subscription
          if (newStatus === "COMPLETED" && payment.subscriptionId) {
            const subscription = await db.subscription.findUnique({
              where: { id: payment.subscriptionId },
            });

            if (subscription) {
              await db.user.update({
                where: { id: payment.userId },
                data: {
                  currentPlan: subscription.plan,
                  subscriptionExpiry: subscription.endDate,
                },
              });

              // Update subscription status to active
              await db.subscription.update({
                where: { id: subscription.id },
                data: { status: "active" },
              });
            }
          }
        }

        return NextResponse.json({ status: newStatus });
      }
    }

    // If no invoice ID or failed to check, return current status
    return NextResponse.json({ status: payment.status });
  } catch (error) {
    console.error("Error checking payment:", error);
    return NextResponse.json(
      { error: "Failed to check payment" },
      { status: 500 }
    );
  }
}
