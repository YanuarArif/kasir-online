import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import PurchasesPage from "@/components/pages/dashboard/purchases/purchases";
import { getPurchases } from "@/actions/purchases";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Role } from "@prisma/client";

// This is now an async Server Component
const Purchases = async () => {
  // Fetch purchases for the current user
  const { purchases, error } = await getPurchases();

  if (error) {
    console.error("Error fetching purchases:", error);
    return <p>Error: {error}</p>;
  }

  return (
    <ProtectedRoute allowedRoles={[Role.OWNER, Role.ADMIN]}>
      <DashboardLayout>
        <Head>
          <title>Pembelian - Kasir Online</title>
        </Head>

        {/* Pass the fetched purchases to the client component */}
        <PurchasesPage purchases={purchases || []} />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Purchases;
