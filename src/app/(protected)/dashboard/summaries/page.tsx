import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import Head from "next/head";
import SummariesPage from "@/components/pages/dashboard/summaries/summaries";

const Summaries = async () => {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <DashboardLayout>
      <Head>
        <title>Ringkasan - Kasir Online</title>
      </Head>
      <SummariesPage />
    </DashboardLayout>
  );
};

export default Summaries;
