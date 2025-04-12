import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";
import { Role } from "@prisma/client";
import { RoleGuard } from "@/components/auth/role-guard";
import UserManagement from "@/components/pages/dashboard/settings/users/user-management";

const UsersSettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout pageTitle="Pengaturan Pengguna">
      <SettingsLayout>
        <RoleGuard allowedRoles={[Role.OWNER, Role.ADMIN]}>
          <UserManagement />
        </RoleGuard>
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default UsersSettingsPage;
