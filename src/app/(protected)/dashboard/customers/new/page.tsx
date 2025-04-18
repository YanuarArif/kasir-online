import React from "react";
import { Metadata } from "next";
import DashboardLayout from "@/components/layout/dashboardlayout";
import EnhancedNewCustomerPage from "@/components/pages/dashboard/customers/new/enhanced-index";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tambah Pelanggan | Kasir Online",
  description: "Tambahkan pelanggan baru ke sistem",
};

const NewCustomer = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <EnhancedNewCustomerPage />
    </DashboardLayout>
  );
};

export default NewCustomer;
