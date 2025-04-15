import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSubscription, getUserSubscription, getUserPaymentHistory } from "@/lib/subscription";
import { SubscriptionPlan } from "@prisma/client";
import { z } from "zod";

// Schema for subscription creation
const CreateSubscriptionSchema = z.object({
  plan: z.enum(["FREE", "BASIC", "PRO", "ENTERPRISE"]),
});

// POST /api/subscriptions - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validatedFields = CreateSubscriptionSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }
    
    const { plan } = validatedFields.data;
    
    const result = await createSubscription(
      session.user.id,
      plan as SubscriptionPlan
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

// GET /api/subscriptions - Get user's subscription
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const includePayments = searchParams.get("include_payments") === "true";
    
    const subscription = await getUserSubscription(session.user.id);
    
    if (includePayments) {
      const payments = await getUserPaymentHistory(session.user.id);
      return NextResponse.json({ subscription, payments });
    }
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error getting subscription:", error);
    return NextResponse.json(
      { error: "Failed to get subscription" },
      { status: 500 }
    );
  }
}
