import React from "react";
import { notFound } from "next/navigation";
import EnhancedSaleEditPage from "@/components/pages/dashboard/sales/edit";
import { getSaleById } from "@/actions/sales";
import { getProducts } from "@/lib/get-products";
import DashboardLayout from "@/components/layout/dashboardlayout";

type Props = {
  params: Promise<{ id: string }>;
};

// This is an async Server Component
export default async function EditSale(props: Props) {
  // Get the id from params (which is now a Promise)
  const params = await props.params;
  const id = params.id;

  // Fetch the sale with the given ID
  const saleResult = await getSaleById(id);

  // If sale not found, return 404
  if (!saleResult.sale) {
    notFound();
  }

  // Fetch products for the form
  const products = await getProducts({
    includeOutOfStock: true, // Include out of stock products for editing
    orderBy: "name",
    orderDirection: "asc",
  });

  if (!products) {
    return (
      <DashboardLayout pageTitle="Edit Penjualan">
        <div className="container mx-auto px-4 py-6">
          <p className="text-red-500">
            Gagal memuat data produk. Silakan coba lagi nanti.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Edit Penjualan">
      <EnhancedSaleEditPage sale={saleResult.sale} products={products} />
    </DashboardLayout>
  );
}
