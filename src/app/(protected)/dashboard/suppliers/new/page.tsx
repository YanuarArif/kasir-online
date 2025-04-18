import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import EnhancedSupplierPage from "@/components/pages/dashboard/suppliers/new/enhanced-index";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const NewSupplier = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Tambah Supplier - Kasir Online</title>
      </Head>

      <EnhancedSupplierPage />
    </DashboardLayout>
  );
};

export default NewSupplier;
