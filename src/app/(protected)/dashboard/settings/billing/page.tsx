import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import BillingSettings from "@/components/pages/dashboard/settings/billing/billing-settings";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";

const BillingSettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout pageTitle="Tagihan & Langganan">
      <SettingsLayout>
        <BillingSettings />
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default BillingSettingsPage;
