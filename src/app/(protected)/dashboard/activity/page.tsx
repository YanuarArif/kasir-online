import React from "react";
import ActivityPage from "@/components/pages/dashboard/activity/activity-page";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Role } from "@prisma/client";

const ActivityPageContainer = async () => {
  return (
    <ProtectedRoute allowedRoles={[Role.OWNER, Role.ADMIN, Role.CASHIER]}>
      <DashboardLayout pageTitle="Aktivitas Sistem">
        <ActivityPage />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ActivityPageContainer;
