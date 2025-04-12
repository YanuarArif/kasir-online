import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { Role } from "@prisma/client";
import { RoleGuardClient } from "@/components/auth/role-guard-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheckIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

const RbacDemoPage = async () => {
  return (
    <DashboardLayout pageTitle="RBAC Demo">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Role-Based Access Control Demo</CardTitle>
            <CardDescription>
              This page demonstrates how content can be conditionally rendered based on user roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <InformationCircleIcon className="h-4 w-4" />
              <AlertTitle>How it works</AlertTitle>
              <AlertDescription>
                Different sections of this page are only visible to users with specific roles.
                Try logging in with different user roles to see how the content changes.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content visible to all roles */}
              <Card>
                <CardHeader className="bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-500" />
                    <CardTitle className="text-lg">All Roles</CardTitle>
                  </div>
                  <CardDescription>
                    Visible to: Owner, Admin, Cashier
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    This content is visible to all authenticated users regardless of their role.
                    It contains basic information and functionality that everyone needs.
                  </p>
                </CardContent>
              </Card>

              {/* Content visible only to Cashiers */}
              <RoleGuardClient allowedRoles={[Role.CASHIER]} showMessage={false}>
                <Card>
                  <CardHeader className="bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-500" />
                      <CardTitle className="text-lg">Cashier Only</CardTitle>
                    </div>
                    <CardDescription>
                      Visible to: Cashier
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      This content is only visible to users with the Cashier role.
                      It contains cashier-specific information and functionality.
                    </p>
                  </CardContent>
                </Card>
              </RoleGuardClient>

              {/* Content visible only to Admins */}
              <RoleGuardClient allowedRoles={[Role.ADMIN]} showMessage={false}>
                <Card>
                  <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-500" />
                      <CardTitle className="text-lg">Admin Only</CardTitle>
                    </div>
                    <CardDescription>
                      Visible to: Admin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      This content is only visible to users with the Admin role.
                      It contains admin-specific information and functionality.
                    </p>
                  </CardContent>
                </Card>
              </RoleGuardClient>

              {/* Content visible only to Owners */}
              <RoleGuardClient allowedRoles={[Role.OWNER]} showMessage={false}>
                <Card>
                  <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-purple-500" />
                      <CardTitle className="text-lg">Owner Only</CardTitle>
                    </div>
                    <CardDescription>
                      Visible to: Owner
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      This content is only visible to users with the Owner role.
                      It contains owner-specific information and functionality.
                    </p>
                  </CardContent>
                </Card>
              </RoleGuardClient>

              {/* Content visible to Admins and Owners */}
              <RoleGuardClient allowedRoles={[Role.OWNER, Role.ADMIN]} showMessage={false}>
                <Card>
                  <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-indigo-500" />
                      <CardTitle className="text-lg">Admin & Owner</CardTitle>
                    </div>
                    <CardDescription>
                      Visible to: Owner, Admin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      This content is visible to users with either the Owner or Admin role.
                      It contains management information and functionality.
                    </p>
                  </CardContent>
                </Card>
              </RoleGuardClient>

              {/* Content visible to Cashiers and Admins */}
              <RoleGuardClient allowedRoles={[Role.CASHIER, Role.ADMIN]} showMessage={false}>
                <Card>
                  <CardHeader className="bg-teal-50 dark:bg-teal-900/20">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-teal-500" />
                      <CardTitle className="text-lg">Cashier & Admin</CardTitle>
                    </div>
                    <CardDescription>
                      Visible to: Cashier, Admin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      This content is visible to users with either the Cashier or Admin role.
                      It contains operational information and functionality.
                    </p>
                  </CardContent>
                </Card>
              </RoleGuardClient>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific sections with access messages */}
        <div className="space-y-6">
          <RoleGuardClient allowedRoles={[Role.OWNER]} fallback={null}>
            <Card>
              <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
                <CardTitle>Owner Section</CardTitle>
                <CardDescription>
                  This section is only visible to Owners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  As an Owner, you have full access to all features and settings in the system.
                  This includes employee management, billing, and business configuration.
                </p>
              </CardContent>
            </Card>
          </RoleGuardClient>

          <RoleGuardClient allowedRoles={[Role.ADMIN]}>
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                <CardTitle>Admin Section</CardTitle>
                <CardDescription>
                  This section is only visible to Admins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  As an Admin, you have access to most features in the system except for
                  employee management and billing information.
                </p>
              </CardContent>
            </Card>
          </RoleGuardClient>

          <RoleGuardClient allowedRoles={[Role.CASHIER]}>
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <CardTitle>Cashier Section</CardTitle>
                <CardDescription>
                  This section is only visible to Cashiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  As a Cashier, you have access to sales, products, and customer information.
                  You can create new sales and manage customer data.
                </p>
              </CardContent>
            </Card>
          </RoleGuardClient>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RbacDemoPage;
