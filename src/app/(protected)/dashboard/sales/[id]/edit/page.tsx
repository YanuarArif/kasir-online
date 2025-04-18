import React from "react";
import { notFound } from "next/navigation";
import EnhancedSaleEditPage from "@/components/pages/dashboard/sales/edit";
import SaleEditErrorFallback from "@/components/pages/dashboard/sales/edit/error-fallback";
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
  try {
    const products = await getProducts({
      includeOutOfStock: true, // Include out of stock products for editing
      orderBy: "name",
      orderDirection: "asc",
    });

    console.log(
      "Products loaded for sale edit:",
      products ? products.length : 0
    );

    // Use the error fallback component if data loading fails
    if (!products) {
      return (
        <DashboardLayout>
          <SaleEditErrorFallback
            saleId={id}
            errorMessage="Gagal memuat data produk. Silakan coba lagi nanti."
          />
        </DashboardLayout>
      );
    }

    // Convert Date objects to strings to match the expected interface
    const serializedSale = {
      ...saleResult.sale,
      saleDate:
        saleResult.sale.saleDate instanceof Date
          ? saleResult.sale.saleDate.toISOString()
          : saleResult.sale.saleDate,
      createdAt:
        saleResult.sale.createdAt instanceof Date
          ? saleResult.sale.createdAt.toISOString()
          : saleResult.sale.createdAt,
      updatedAt:
        saleResult.sale.updatedAt instanceof Date
          ? saleResult.sale.updatedAt.toISOString()
          : saleResult.sale.updatedAt,
    };

    return (
      <DashboardLayout>
        <EnhancedSaleEditPage sale={serializedSale} products={products} />
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Error loading data for sale edit page:", error);
    return (
      <DashboardLayout>
        <SaleEditErrorFallback
          saleId={id}
          errorMessage="Terjadi kesalahan saat memuat data. Silakan coba lagi nanti."
        />
      </DashboardLayout>
    );
  }
}
