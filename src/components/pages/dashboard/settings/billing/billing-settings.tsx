"use client";

import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import SubscriptionPlans from "@/components/subscription/subscription-plans";
import PaymentHistory from "@/components/subscription/payment-history";
import CurrentSubscription from "@/components/subscription/current-subscription";
import { SubscriptionPlan } from "@prisma/client";

interface BillingSettingsProps {
  initialData?: {
    plan: SubscriptionPlan;
    expiryDate: string | null;
    isActive: boolean;
  };
}

export default function BillingSettings({ initialData }: BillingSettingsProps) {
  const [subscription, setSubscription] = useState(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);

  // Fetch subscription data if not provided
  const fetchSubscription = async () => {
    if (initialData) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/subscriptions");

      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      const data = await response.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load subscription on component mount if not provided
  useEffect(() => {
    fetchSubscription();
  }, [initialData]);

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <CreditCard className="h-7 w-7 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Tagihan & Langganan
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Kelola langganan dan metode pembayaran Anda
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Current Subscription */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Langganan Saat Ini
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Informasi langganan dan status pembayaran Anda
          </p>

          <CurrentSubscription initialData={subscription} />
        </div>

        {/* Available Plans */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Pilih Paket Langganan
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pilih paket yang sesuai dengan kebutuhan bisnis Anda
          </p>

          <SubscriptionPlans
            currentPlan={subscription?.plan}
            expiryDate={
              subscription?.expiryDate
                ? new Date(subscription.expiryDate)
                : null
            }
          />
        </div>

        {/* Payment History */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Riwayat Pembayaran
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lihat riwayat pembayaran dan status langganan Anda
          </p>

          <PaymentHistory />
        </div>
      </div>
    </div>
  );
}
