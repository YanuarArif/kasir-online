import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import CustomersPage from "@/components/pages/dashboard/customers/customers";
import { auth } from "@/lib/auth";
import { getCustomers } from "@/actions/customers";
import { redirect } from "next/navigation";

const Customers = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch customers for the current user
  const { customers, error } = await getCustomers();

  if (error) {
    console.error("Error fetching customers:", error);
    return <p>Error: {error}</p>;
  }

  return (
    <DashboardLayout pageTitle="Daftar Customers">
      <Head>
        <title>Daftar Customers - Kasir Online</title>
      </Head>

      {/* Pass the fetched customers to the client component */}
      <CustomersPage customers={customers || []} />
    </DashboardLayout>
  );
};

export default Customers;
