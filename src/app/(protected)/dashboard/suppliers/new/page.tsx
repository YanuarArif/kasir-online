import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import NewSupplierPage from "@/components/pages/dashboard/suppliers/new";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const NewSupplier = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout pageTitle="Tambah Supplier Baru">
      <Head>
        <title>Tambah Supplier - Kasir Online</title>
      </Head>

      <NewSupplierPage />
    </DashboardLayout>
  );
};

export default NewSupplier;
