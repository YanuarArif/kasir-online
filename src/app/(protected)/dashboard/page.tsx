import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import RoleBasedDashboard from "@/components/pages/dashboard/role-based-dashboard";
import DashboardHomePage from "@/components/pages/dashboard";

const Dashboard = async () => {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <DashboardLayout pageTitle="Dashboard">
      <RoleBasedDashboard />
    </DashboardLayout>
  );
};

export default Dashboard;
