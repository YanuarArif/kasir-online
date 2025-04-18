import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import SecuritySettings from "@/components/pages/dashboard/settings/security/security-settings";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";

const SecuritySettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <SettingsLayout>
        <SecuritySettings />
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default SecuritySettingsPage;
