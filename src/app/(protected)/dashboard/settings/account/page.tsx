import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import React from "react";
import AccountSettings from "@/components/pages/dashboard/settings/account/account-settings";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";

const AccountSettingsPage = async () => {
  const session = await auth();

  // Fetch user data from database - we can assume session exists due to middleware protection
  const user = session?.user?.id
    ? await db.user.findUnique({
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
      })
    : null;

  // Use a default user object with empty values if user is null
  const userData = user || {
    id: session?.user?.id || "",
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    username: "",
    image: session?.user?.image || "",
  };

  return (
    <DashboardLayout pageTitle="Pengaturan Akun">
      <SettingsLayout>
        <AccountSettings user={userData} />
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default AccountSettingsPage;
