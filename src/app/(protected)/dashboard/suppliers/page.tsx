import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SuppliersPage from "@/components/pages/dashboard/suppliers/suppliers";
import { auth } from "@/lib/auth";
import { getSuppliers } from "@/actions/suppliers";
import { redirect } from "next/navigation";

const Suppliers = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch suppliers for the current user
  const { suppliers, error } = await getSuppliers();

  if (error) {
    console.error("Error fetching suppliers:", error);
    return <p>Error: {error}</p>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Suppliers - Kasir Online</title>
      </Head>

      {/* Pass the fetched suppliers to the client component */}
      <SuppliersPage suppliers={suppliers || []} />
    </DashboardLayout>
  );
};

export default Suppliers;
