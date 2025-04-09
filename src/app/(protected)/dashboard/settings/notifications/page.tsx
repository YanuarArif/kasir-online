import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import NotificationsSettings from "@/components/pages/dashboard/settings/notifications/notifications-settings";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";

const NotificationsSettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout pageTitle="Pengaturan Notifikasi">
      <SettingsLayout>
        <NotificationsSettings />
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default NotificationsSettingsPage;
