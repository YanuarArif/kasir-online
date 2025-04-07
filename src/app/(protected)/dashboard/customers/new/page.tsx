import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import NewCustomerPage from "@/components/pages/dashboard/customers/new";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const NewCustomer = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout pageTitle="Tambah Pelanggan Baru">
      <Head>
        <title>Tambah Pelanggan - Kasir Online</title>
      </Head>

      <NewCustomerPage />
    </DashboardLayout>
  );
};

export default NewCustomer;
