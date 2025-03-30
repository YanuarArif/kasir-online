import ProductsPage from "@/app/pages/dashboard/products/products";
import React from "react";
import { db } from "@/lib/prisma"; // Import Prisma client

// This is now an async Server Component
const Products = async () => {
  // Fetch products directly from the database
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc", // Optional: Order by creation date
    },
    // You might want to add select or include here if needed
    // e.g., include: { category: true } if you add category display later
  });

  // Pass the fetched products to the client component
  // Note: Prisma Decimal type needs serialization handling if passed directly
  // to client components. Let's convert Decimal to string or number here.
  const serializedProducts = products.map((product) => ({
    ...product,
    price: product.price.toNumber(), // Convert Decimal to number
    cost: product.cost ? product.cost.toNumber() : null, // Convert Decimal to number or null
  }));

  return <ProductsPage products={serializedProducts} />;
};

export default Products;
