import ProductsPage from "@/components/pages/dashboard/products/products";
import React from "react";
import { getProducts, getProductStockCounts } from "@/lib/get-products";
import { db } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { Category } from "@/components/pages/dashboard/products/types";

// This is an async Server Component
const Products = async () => {
  try {
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
    let categories: Category[] = [];

    if (effectiveUserId) {
      categories = await db.category.findMany({
        where: { userId: effectiveUserId },
        orderBy: { name: "asc" },
      });
    }

    // Always render the ProductsPage component, even if no products were found
    // The ProductTableDesktop and ProductListMobile components will handle showing appropriate messages

    return (
      <ProductsPage
        products={serializedProducts}
        stockCounts={stockCounts}
        categories={categories}
      />
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    return (
      <p>Error: Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
    );
  }
};

export default Products;
