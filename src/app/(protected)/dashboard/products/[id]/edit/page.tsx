import React from "react";
import { notFound } from "next/navigation";
import EnhancedEditProductPage from "@/components/pages/dashboard/products/edit";
import { getProductById } from "@/lib/get-products";

type Props = {
  params: Promise<{ id: string }>;
};

// This is an async Server Component
export default async function EditProduct(props: Props) {
  // Get the id from params (which is now a Promise)
  const params = await props.params;
  const id = params.id;

  // Fetch the product with the given ID using our utility function
  const serializedProduct = await getProductById(id);

  // If product not found, return 404
  if (!serializedProduct) {
    notFound();
  }

  return <EnhancedEditProductPage product={serializedProduct} />;
}
