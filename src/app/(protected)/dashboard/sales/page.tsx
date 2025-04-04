import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SalesPage from "@/app/pages/dashboard/sales/sales";
import { auth } from "@/lib/auth";
import { getSales } from "@/actions/sales";

// This is now an async Server Component
const Sales = async () => {
  // Get current session
  const session = await auth();
  // Assuming middleware guarantees user is authenticated for this route
  const userId = session?.user?.id;

  // If userId is somehow still null/undefined here, it indicates a deeper issue,
  // but we'll proceed assuming middleware works. Consider adding error handling if needed.
  if (!userId) {
    // This case should ideally not be reached if middleware is correct
    console.error("User ID not found in session on protected route.");
    return <p>Error: User tidak ditemukan.</p>; // Or handle differently
  }

  // Fetch sales for the current user
  const { sales, error } = await getSales();

  if (error) {
    console.error("Error fetching sales:", error);
    return <p>Error: {error}</p>;
  }

  return (
    <DashboardLayout pageTitle="Penjualan">
      <Head>
        <title>Penjualan - Kasir Online</title>
      </Head>

      {/* Pass the fetched sales to the client component */}
      <SalesPage sales={sales || []} />
    </DashboardLayout>
  );
};

export default Sales;
