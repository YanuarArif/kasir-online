import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { Role } from "@prisma/client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { 
  ChartBarIcon, 
  CreditCardIcon, 
  UserGroupIcon, 
  BuildingStorefrontIcon,
  CogIcon
} from "@heroicons/react/24/outline";

const OwnerOnlyPage = async () => {
  return (
    <ProtectedRoute allowedRoles={[Role.OWNER]}>
      <DashboardLayout pageTitle="Owner Dashboard">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Owner Control Panel</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              This page can only be accessed by users with the Owner role.
              Here you can manage your business, employees, and access advanced settings.
            </p>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-purple-800 dark:text-purple-300">
                Welcome to the Owner Dashboard. As the business owner, you have full access to all features and settings.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <UserGroupIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium">Employee Management</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Manage your employees, set roles, and control access permissions.
              </p>
              <a 
                href="/dashboard/settings/employees" 
                className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Manage Employees
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="text-lg font-medium">Business Analytics</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                View detailed reports and analytics about your business performance.
              </p>
              <a 
                href="/dashboard/reports" 
                className="block w-full text-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                View Reports
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <CreditCardIcon className="h-6 w-6 text-purple-500 mr-2" />
                <h3 className="text-lg font-medium">Billing & Subscription</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Manage your subscription plan and billing information.
              </p>
              <a 
                href="/dashboard/billing" 
                className="block w-full text-center bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Manage Billing
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <BuildingStorefrontIcon className="h-6 w-6 text-orange-500 mr-2" />
                <h3 className="text-lg font-medium">Business Settings</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Configure your business information, store details, and operational settings.
              </p>
              <div className="space-y-3">
                <a 
                  href="/dashboard/settings/business" 
                  className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Business Settings
                </a>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <CogIcon className="h-6 w-6 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium">System Configuration</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Advanced system settings and configuration options.
              </p>
              <div className="space-y-3">
                <a 
                  href="/dashboard/settings" 
                  className="block w-full text-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  System Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default OwnerOnlyPage;
