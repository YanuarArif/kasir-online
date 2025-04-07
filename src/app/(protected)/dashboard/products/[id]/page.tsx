import React from "react";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/pages/dashboard/products/detail";

type Props = {
  params: Promise<{ id: string }>;
};

// This is an async Server Component
export default async function ProductDetail(props: Props) {
  // Get current session
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error("User ID not found in session on protected route.");
    return <p>Error: User tidak ditemukan.</p>;
  }

  // Get the id from params (which is now a Promise)
  const params = await props.params;
  const id = params.id;

  // Fetch the product with the given ID
  const product = await db.product.findUnique({
    where: {
      id: id,
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
}
