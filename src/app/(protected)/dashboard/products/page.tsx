import ProductsPage from "@/components/pages/dashboard/products/products";
import React from "react";
import { getProducts, getProductStockCounts } from "@/lib/get-products";
import { db } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/get-effective-user-id";

// This is an async Server Component
const Products = async () => {
  // Fetch products using our utility function that handles employee access
  const serializedProducts = await getProducts({
    orderBy: "createdAt",
    orderDirection: "desc",
    includeOutOfStock: true,
  });

  // Get product stock counts
  const stockCounts = await getProductStockCounts();

  // Get categories for filtering
  const effectiveUserId = await getEffectiveUserId();
  let categories = [];

  if (effectiveUserId) {
    categories = await db.category.findMany({
      where: { userId: effectiveUserId },
      orderBy: { name: "asc" },
    });
  }

  // If no products were found, it could be due to authentication issues
  if (!serializedProducts) {
    return <p>Error: Tidak dapat mengambil data produk.</p>;
  }

  return (
    <ProductsPage
      products={serializedProducts}
      stockCounts={stockCounts}
      categories={categories}
    />
  );
};

export default Products;
