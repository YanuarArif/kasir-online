import React from "react";
import NotificationsPage from "@/components/pages/dashboard/notifications/notifications-page";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Role } from "@prisma/client";

const NotificationsPageContainer = async () => {
  return (
    <ProtectedRoute allowedRoles={[Role.OWNER, Role.ADMIN, Role.CASHIER]}>
      <DashboardLayout pageTitle="Notifikasi">
        <NotificationsPage />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default NotificationsPageContainer;
