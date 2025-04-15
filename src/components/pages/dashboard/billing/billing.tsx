"use client";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CurrentSubscription from "@/components/subscription/current-subscription";
import PaymentHistory from "@/components/subscription/payment-history";
import { SubscriptionPlan } from "@prisma/client";

interface BillingPageProps {
  initialData?: {
    plan: SubscriptionPlan;
    expiryDate: string | null;
    isActive: boolean;
  };
}

const BillingPage: NextPage<BillingPageProps> = ({ initialData }) => {
  const router = useRouter();
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Current Subscription Section */}
      <CurrentSubscription initialData={subscription} />

      {/* Payment History Section */}
      <PaymentHistory />

      {/* Manage Subscription Button */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={() => router.push("/dashboard/settings/billing")}
          className="px-6"
        >
          Kelola Langganan
        </Button>
      </div>
    </div>
  );
};

export default BillingPage;
