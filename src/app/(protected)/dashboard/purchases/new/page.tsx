import React from "react";
import Head from "next/head";
import Link from "next/link";
import DashboardLayout from "@/components/layout/dashboardlayout";
import EnhancedPurchasePage from "@/components/pages/dashboard/purchases/new/enhanced-index";
import { getProducts } from "@/lib/get-products";
import { getSuppliers } from "@/lib/get-suppliers";
import { Button } from "@/components/ui/button";

// This is an async Server Component
const NewPurchase = async () => {
  // Fetch products using our utility function that handles employee access
  const serializedProducts = await getProducts({
    includeOutOfStock: true, // Show all products for purchases
    orderBy: "name",
    orderDirection: "asc",
  });

  // Fetch suppliers using our utility function
  const suppliersResult = await getSuppliers();

  // If no products were found, it could be due to authentication issues
  if (!serializedProducts || serializedProducts.length === 0) {
    return (
      <DashboardLayout pageTitle="Tambah Pembelian Baru">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tidak dapat mengambil data produk.
            </p>
            <Button asChild>
              <Link href="/dashboard/purchases">
                Kembali ke Daftar Pembelian
              </Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // If there was an error fetching suppliers, we'll still allow the user to proceed
  // with an empty suppliers list, and show the error in the UI

  // Even if there are no suppliers, we'll still show the UI
  // The user can add a supplier later or proceed without one

  return (
    <DashboardLayout pageTitle="Tambah Pembelian Baru">
      <Head>
        <title>Tambah Pembelian - Kasir Online</title>
      </Head>

      <EnhancedPurchasePage
        products={serializedProducts}
        suppliers={suppliersResult.suppliers || []}
      />
    </DashboardLayout>
  );
};

export default NewPurchase;
