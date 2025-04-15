import { db } from "@/lib/prisma";
import { SubscriptionPlan, PaymentStatus } from "@prisma/client";
import { createInvoice } from "@/lib/xendit";
import { addMonths } from "date-fns";

// Define subscription plan details
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: "Gratis",
    price: 0,
    period: "selamanya",
    description: "Untuk bisnis kecil atau individu",
    features: [
      "1 pengguna",
      "Manajemen produk dasar",
      "Pencatatan penjualan",
      "Laporan dasar",
    ],
    durationMonths: 0, // Forever
  },
  BASIC: {
    name: "Dasar",
    price: 99000,
    period: "per bulan",
    description: "Untuk bisnis kecil hingga menengah",
    features: [
      "3 pengguna",
      "Manajemen produk lengkap",
      "Pencatatan penjualan & pembelian",
      "Laporan lengkap",
      "Dukungan email",
    ],
    durationMonths: 1,
  },
  PRO: {
    name: "Pro",
    price: 199000,
    period: "per bulan",
    description: "Untuk bisnis menengah hingga besar",
    features: [
      "10 pengguna",
      "Semua fitur paket Dasar",
      "Integrasi dengan sistem lain",
      "Dukungan premium 24/7",
      "Fitur analitik lanjutan",
    ],
    durationMonths: 1,
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 499000,
    period: "per bulan",
    description: "Untuk perusahaan besar dengan kebutuhan khusus",
    features: [
      "Pengguna tidak terbatas",
      "Semua fitur paket Pro",
      "Kustomisasi sesuai kebutuhan",
      "Dukungan prioritas",
      "Pelatihan khusus",
      "API akses penuh",
    ],
    durationMonths: 1,
  },
};

// Get subscription plan details
export function getPlanDetails(plan: SubscriptionPlan) {
  return SUBSCRIPTION_PLANS[plan];
}

// Create a new subscription
export async function createSubscription(
  userId: string,
  plan: SubscriptionPlan
) {
  const planDetails = getPlanDetails(plan);

  if (!planDetails) {
    throw new Error("Invalid subscription plan");
  }

  // Calculate end date based on plan duration
  const endDate = planDetails.durationMonths
    ? addMonths(new Date(), planDetails.durationMonths)
    : null; // For FREE plan, no end date

  try {
    // Create subscription in database
    const subscription = await db.subscription.create({
      data: {
        userId,
        plan,
        endDate: endDate || new Date(2099, 11, 31), // Far future date for FREE plan
        autoRenew: plan !== "FREE", // Auto-renew for paid plans
      },
    });

    // For paid plans, create a payment record
    if (plan !== "FREE" && planDetails.price > 0) {
      const externalId = `sub_${subscription.id}_${Date.now()}`;

      // Create payment record in database
      const payment = await db.payment.create({
        data: {
          userId,
          subscriptionId: subscription.id,
          amount: planDetails.price,
          status: PaymentStatus.PENDING,
          externalId,
        },
      });

      // Create Xendit invoice
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, phone: true },
      });

      const invoiceResult = await createInvoice({
        externalId,
        amount: planDetails.price,
        description: `Langganan ${planDetails.name} - ${planDetails.durationMonths} bulan`,
        customer: {
          email: user?.email || undefined,
          name: user?.name || undefined,
          mobile_number: user?.phone || undefined,
        },
        successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing/success?payment_id=${payment.id}`,
        failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing/failed?payment_id=${payment.id}`,
        items: [
          {
            name: `Langganan ${planDetails.name}`,
            quantity: 1,
            price: planDetails.price,
            category: "Subscription",
          },
        ],
      });

      if (invoiceResult.success && invoiceResult.data) {
        // Update payment record with Xendit invoice details
        await db.payment.update({
          where: { id: payment.id },
          data: {
            invoiceId: invoiceResult.data.id,
            externalUrl: invoiceResult.data.invoiceUrl,
            expiryDate: new Date(invoiceResult.data.expiryDate),
          },
        });

        return {
          subscription,
          payment,
          invoiceUrl: invoiceResult.data.invoiceUrl,
        };
      } else {
        throw new Error("Failed to create payment invoice");
      }
    }

    // For FREE plan, update user's subscription immediately
    if (plan === "FREE") {
      await db.user.update({
        where: { id: userId },
        data: {
          currentPlan: plan,
          subscriptionExpiry: endDate,
        },
      });
    }

    return { subscription };
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

// Update user's subscription status based on payment
export async function updateSubscriptionStatus(
  paymentId: string,
  status: PaymentStatus
) {
  try {
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: { subscription: true },
    });

    if (!payment || !payment.subscription) {
      throw new Error("Payment or subscription not found");
    }

    // Update payment status
    await db.payment.update({
      where: { id: paymentId },
      data: {
        status,
        paymentDate: status === PaymentStatus.COMPLETED ? new Date() : null,
      },
    });

    // If payment is completed, update user's subscription
    if (status === PaymentStatus.COMPLETED) {
      await db.user.update({
        where: { id: payment.userId },
        data: {
          currentPlan: payment.subscription.plan,
          subscriptionExpiry: payment.subscription.endDate,
        },
      });

      // Update subscription status to active
      await db.subscription.update({
        where: { id: payment.subscription.id },
        data: { status: "active" },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return { success: false, error };
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    // Update subscription status to canceled
    await db.subscription.update({
      where: { id: subscriptionId },
      data: { status: "canceled", autoRenew: false },
    });

    return { success: true };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { success: false, error };
  }
}

// Get user's active subscription
export async function getUserSubscription(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        currentPlan: true,
        subscriptionExpiry: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const planDetails = getPlanDetails(user.currentPlan);

    return {
      plan: user.currentPlan,
      planDetails,
      expiryDate: user.subscriptionExpiry,
      isActive: user.subscriptionExpiry
        ? new Date(user.subscriptionExpiry) > new Date()
        : true,
    };
  } catch (error) {
    console.error("Error getting user subscription:", error);
    throw error;
  }
}

// Get user's payment history
export async function getUserPaymentHistory(userId: string) {
  try {
    const payments = await db.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { subscription: true },
    });

    return payments;
  } catch (error) {
    console.error("Error getting payment history:", error);
    throw error;
  }
}

// Check if a payment is completed
export async function isPaymentCompleted(paymentId: string) {
  try {
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
    });

    return payment?.status === PaymentStatus.COMPLETED;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return false;
  }
}
