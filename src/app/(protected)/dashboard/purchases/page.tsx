import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import PurchasesPage from "@/app/pages/dashboard/purchases/purchases";
import { auth } from "@/lib/auth";
import { getPurchases } from "@/actions/purchases";

// This is now an async Server Component
const Purchases = async () => {
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

  // Fetch purchases for the current user
  const { purchases, error } = await getPurchases();

  if (error) {
    console.error("Error fetching purchases:", error);
    return <p>Error: {error}</p>;
  }

  return (
    <DashboardLayout pageTitle="Pembelian">
      <Head>
        <title>Pembelian - Kasir Online</title>
      </Head>

      {/* Pass the fetched purchases to the client component */}
      <PurchasesPage purchases={purchases || []} />
    </DashboardLayout>
  );
};

export default Purchases;
