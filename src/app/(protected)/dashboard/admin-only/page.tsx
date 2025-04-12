import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { Role } from "@prisma/client";
import { ProtectedRoute } from "@/components/auth/protected-route";

const AdminOnlyPage = async () => {
  return (
    <ProtectedRoute allowedRoles={[Role.OWNER, Role.ADMIN]}>
      <DashboardLayout pageTitle="Admin Only Page">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Admin Only Content</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              This page can only be accessed by users with the Owner or Admin role.
              If a Cashier tries to access this page directly, they will be redirected to the dashboard.
            </p>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-300">
                You have successfully accessed this restricted page because you have the required role permissions.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-3">Admin Features</h3>
              <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Manage user roles and permissions</li>
                <li>Access to sensitive business data</li>
                <li>Generate advanced reports</li>
                <li>Configure system settings</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-3">Role-Based Security</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our application implements role-based access control (RBAC) to ensure that users can only access
                the features and data they are authorized to use. This helps maintain security and data integrity.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminOnlyPage;
