import React from "react";
import { Metadata } from "next";
import DashboardLayout from "@/components/layout/dashboardlayout";
import CustomersPage from "@/components/pages/dashboard/customers/customers";
import { auth } from "@/lib/auth";
import { getCustomers } from "@/actions/customers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Pelanggan | Kasir Online",
  description: "Kelola data pelanggan Anda",
};

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
    <DashboardLayout pageTitle="Daftar Pelanggan">
      {/* Pass the fetched customers to the client component */}
      <CustomersPage customers={customers || []} />
    </DashboardLayout>
  );
};

export default Customers;
