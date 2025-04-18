import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import BillingSettings from "@/components/pages/dashboard/settings/billing/billing-settings";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";
import { getUserSubscription } from "@/lib/subscription";

const BillingSettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get user's subscription
  const subscription = await getUserSubscription(session.user.id);

  // Extract only the properties needed by the component
  const subscriptionData = {
    plan: subscription.plan,
    expiryDate: subscription.expiryDate
      ? subscription.expiryDate.toISOString()
      : null,
    isActive: subscription.isActive,
  };

  return (
    <DashboardLayout>
      <SettingsLayout>
        <BillingSettings initialData={subscriptionData} />
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default BillingSettingsPage;
