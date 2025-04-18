import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";
import { Role } from "@prisma/client";
import EmployeeManagement from "@/components/pages/dashboard/settings/employees/employee-management";
import { ProtectedRoute } from "@/components/auth/protected-route";

const EmployeesSettingsPage = async () => {
  return (
    <ProtectedRoute allowedRoles={[Role.OWNER]}>
      <DashboardLayout>
        <SettingsLayout>
          <EmployeeManagement />
        </SettingsLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default EmployeesSettingsPage;
