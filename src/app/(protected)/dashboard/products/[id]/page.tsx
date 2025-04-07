import React from "react";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/pages/dashboard/products/detail";

// This is an async Server Component
const ProductDetail = async ({ params }: { params: { id: string } }) => {
  // Get current session
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error("User ID not found in session on protected route.");
    return <p>Error: User tidak ditemukan.</p>;
  }

  // Fetch the product with the given ID
  const product = await db.product.findUnique({
    where: {
      id: params.id,
      userId: userId, // Ensure the product belongs to the current user
    },
    include: {
      category: true, // Include the category if needed
    },
  });

  // If product not found, return 404
  if (!product) {
    notFound();
  }

  // Convert Decimal to number for serialization
  const serializedProduct = {
    ...product,
    price: product.price.toNumber(),
    cost: product.cost ? product.cost.toNumber() : null,
  };

  return <ProductDetailPage product={serializedProduct} />;
};

export default ProductDetail;
