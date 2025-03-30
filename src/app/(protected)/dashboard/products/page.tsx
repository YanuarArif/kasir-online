import ProductsPage from "@/app/pages/dashboard/products/products";
import React from "react";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Import auth

// This is now an async Server Component
const Products = async () => {
  // Get current session
  const session = await auth();
  // Assuming middleware guarantees user is authenticated for this route
  const userId = session?.user?.id;

  // If userId is somehow still null/undefined here, it indicates a deeper issue,
  // but we'll proceed assuming middleware works. Consider adding error handling if needed.
  if (!userId) {
    // This case should ideally not be reached if middleware is correct
    // You could throw an error or return an empty state
    console.error("User ID not found in session on protected route.");
    return <p>Error: User tidak ditemukan.</p>; // Or handle differently
  }

  // Fetch products for the current user
  const products = await db.product.findMany({
    where: {
      userId: userId, // Filter by userId
    },
    orderBy: {
      createdAt: "desc", // Optional: Order by creation date
    },
    // You might want to add select or include here if needed
    // e.g., include: { category: true } if you add category display later
  });

  // Pass the fetched products to the client component
  // Note: Prisma Decimal type needs serialization handling if passed directly
  // to client components. Convert Decimal to number or string.
  const serializedProducts = products.map((product) => ({
    ...product,
    price: product.price.toNumber(), // Convert Decimal to number
    cost: product.cost ? product.cost.toNumber() : null,
  }));

  return <ProductsPage products={serializedProducts} />;
};

export default Products;
