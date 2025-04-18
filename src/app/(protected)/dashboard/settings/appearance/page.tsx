import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import AppearanceSettings from "@/components/pages/dashboard/settings/appearance/appearance-settings";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";

const AppearanceSettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <SettingsLayout>
        <AppearanceSettings />
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default AppearanceSettingsPage;
