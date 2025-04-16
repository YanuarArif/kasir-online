import React from "react";
import { notFound } from "next/navigation";
import EnhancedPurchaseEditPage from "@/components/pages/dashboard/purchases/edit";
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
  const [products, suppliersResult] = await Promise.all([
    getProducts({
      includeOutOfStock: true, // Include out of stock products for editing
      orderBy: "name",
      orderDirection: "asc",
    }),
    getSuppliers(),
  ]);

  if (!products || !suppliersResult.suppliers) {
    return (
      <DashboardLayout pageTitle="Edit Pembelian">
        <div className="container mx-auto px-4 py-6">
          <p className="text-red-500">
            Gagal memuat data produk atau supplier. Silakan coba lagi nanti.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Edit Pembelian">
      <EnhancedPurchaseEditPage 
        purchase={purchaseResult.purchase} 
        products={products} 
        suppliers={suppliersResult.suppliers} 
      />
    </DashboardLayout>
  );
}
