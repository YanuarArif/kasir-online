import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import EnhancedSalePage from "@/components/pages/dashboard/sales/new/enhanced-index";
import { getProducts } from "@/lib/get-products";

// This is an async Server Component
const NewSale = async () => {
  // Fetch products using our utility function that handles employee access
  const serializedProducts = await getProducts({
    includeOutOfStock: false, // Only show products with stock > 0
    orderBy: "name",
    orderDirection: "asc",
  });

  // If no products were found, it could be due to authentication issues
  if (!serializedProducts || serializedProducts.length === 0) {
    return <p>Error: Tidak ada produk yang tersedia untuk dijual.</p>;
  }

  return (
    <DashboardLayout pageTitle="Tambah Penjualan Baru">
      <Head>
        <title>Tambah Penjualan - Kasir Online</title>
      </Head>

      <EnhancedSalePage products={serializedProducts} />
    </DashboardLayout>
  );
};

export default NewSale;
