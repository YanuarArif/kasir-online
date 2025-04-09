import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import BusinessSettings from "@/components/pages/dashboard/settings/business/business-settings";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";

const BusinessSettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout pageTitle="Pengaturan Bisnis">
      <SettingsLayout>
        <BusinessSettings />
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default BusinessSettingsPage;
