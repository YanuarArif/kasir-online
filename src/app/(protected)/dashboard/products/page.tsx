import ProductsPage from "@/components/pages/dashboard/products/products";
import React from "react";
import { getProducts } from "@/lib/get-products";

// This is an async Server Component
const Products = async () => {
  // Fetch products using our utility function that handles employee access
  const serializedProducts = await getProducts({
    orderBy: "createdAt",
    orderDirection: "desc",
    includeOutOfStock: true,
  });

  // If no products were found, it could be due to authentication issues
  if (!serializedProducts) {
    return <p>Error: Tidak dapat mengambil data produk.</p>;
  }

  return <ProductsPage products={serializedProducts} />;
};

export default Products;
