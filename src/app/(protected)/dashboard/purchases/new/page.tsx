import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import NewPurchasePage from "@/components/pages/dashboard/purchases/new";
import { getProducts } from "@/lib/get-products";
import { getSuppliers } from "@/lib/get-suppliers";

// This is an async Server Component
const NewPurchase = async () => {
  // Fetch products using our utility function that handles employee access
  const serializedProducts = await getProducts({
    includeOutOfStock: true, // Show all products for purchases
    orderBy: "name",
    orderDirection: "asc",
  });

  // Fetch suppliers using our utility function
  const suppliers = await getSuppliers();

  // If no products or suppliers were found, it could be due to authentication issues
  if (!serializedProducts || serializedProducts.length === 0) {
    return <p>Error: Tidak dapat mengambil data produk.</p>;
  }

  if (!suppliers || suppliers.length === 0) {
    return <p>Error: Tidak dapat mengambil data supplier.</p>;
  }

  return (
    <DashboardLayout pageTitle="Tambah Pembelian Baru">
      <Head>
        <title>Tambah Pembelian - Kasir Online</title>
      </Head>

      <NewPurchasePage products={serializedProducts} suppliers={suppliers} />
    </DashboardLayout>
  );
};

export default NewPurchase;
