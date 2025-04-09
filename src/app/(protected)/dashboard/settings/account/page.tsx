import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import AccountSettings from "@/components/pages/dashboard/settings/account/account-settings";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";

const AccountSettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user data from database
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout pageTitle="Pengaturan Akun">
      <SettingsLayout>
        <AccountSettings user={user} />
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default AccountSettingsPage;
