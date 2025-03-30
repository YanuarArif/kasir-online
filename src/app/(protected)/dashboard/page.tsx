import DashboardHomePage from "@/app/pages/dashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main>
      <DashboardHomePage />;
    </main>
  );
};

export default Dashboard;
