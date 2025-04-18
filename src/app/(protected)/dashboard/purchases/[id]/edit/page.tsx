import React from "react";
import { notFound } from "next/navigation";
import EnhancedPurchaseEditPage from "@/components/pages/dashboard/purchases/edit";
import PurchaseEditErrorFallback from "@/components/pages/dashboard/purchases/edit/error-fallback";
import { getPurchaseById } from "@/actions/purchases";
import { getProducts } from "@/lib/get-products";
import { getSuppliers } from "@/lib/get-suppliers";
import DashboardLayout from "@/components/layout/dashboardlayout";

type Props = {
  params: Promise<{ id: string }>;
};

// This is an async Server Component
export default async function EditPurchase(props: Props) {
  // Get the id from params (which is now a Promise)
  const params = await props.params;
  const id = params.id;

  // Fetch the purchase with the given ID
  const purchaseResult = await getPurchaseById(id);

  // If purchase not found, return 404
  if (!purchaseResult.purchase) {
    notFound();
  }

  // Fetch products and suppliers for the form
  try {
    const [products, suppliersResult] = await Promise.all([
      getProducts({
        includeOutOfStock: true, // Include out of stock products for editing
        orderBy: "name",
        orderDirection: "asc",
      }),
      getSuppliers(),
    ]);

    console.log("Products loaded:", products ? products.length : 0);
    console.log("Suppliers result:", suppliersResult);

    // Use the error fallback component if data loading fails
    if (!products) {
      return (
        <DashboardLayout>
          <PurchaseEditErrorFallback
            purchaseId={id}
            errorMessage="Gagal memuat data produk. Silakan coba lagi nanti."
          />
        </DashboardLayout>
      );
    }

    // Check if suppliers were loaded successfully
    if (suppliersResult.error) {
      return (
        <DashboardLayout>
          <PurchaseEditErrorFallback
            purchaseId={id}
            errorMessage={
              suppliersResult.error ||
              "Gagal memuat data supplier. Silakan coba lagi nanti."
            }
          />
        </DashboardLayout>
      );
    }

    // Convert Date objects to strings to match the expected interface
    const serializedPurchase = {
      ...purchaseResult.purchase,
      purchaseDate:
        purchaseResult.purchase.purchaseDate instanceof Date
          ? purchaseResult.purchase.purchaseDate.toISOString()
          : purchaseResult.purchase.purchaseDate,
    };

    return (
      <DashboardLayout>
        <EnhancedPurchaseEditPage
          purchase={serializedPurchase}
          products={products}
          suppliers={suppliersResult.suppliers}
        />
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Error loading data for purchase edit page:", error);
    return (
      <DashboardLayout>
        <PurchaseEditErrorFallback
          purchaseId={id}
          errorMessage="Terjadi kesalahan saat memuat data. Silakan coba lagi nanti."
        />
      </DashboardLayout>
    );
  }
}
