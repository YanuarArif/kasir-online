"use server";

import { db } from "@/lib/prisma";
import { getEffectiveUserId } from "./get-effective-user-id";

/**
 * Fetches products for the current user or their owner if they're an employee
 * @param options Optional query options
 * @returns Array of serialized products
 */
export async function getProducts(options?: {
  includeOutOfStock?: boolean;
  orderBy?: "name" | "createdAt" | "price" | "stock";
  orderDirection?: "asc" | "desc";
  limit?: number;
}) {
  const effectiveUserId = await getEffectiveUserId();
  
  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return [];
  }
  
  // Build the query
  const where = {
    userId: effectiveUserId,
    ...(options?.includeOutOfStock ? {} : { stock: { gt: 0 } }),
  };
  
  // Set up ordering
  const orderField = options?.orderBy || "createdAt";
  const orderDirection = options?.orderDirection || "desc";
  
  // Execute the query
  const products = await db.product.findMany({
    where,
    orderBy: {
      [orderField]: orderDirection,
    },
    ...(options?.limit ? { take: options.limit } : {}),
  });
  
  // Serialize the products for client components
  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    cost: product.cost ? product.cost.toNumber() : null,
  }));
}

/**
 * Fetches a single product by ID
 * @param id Product ID
 * @returns Serialized product or null if not found
 */
export async function getProductById(id: string) {
  const effectiveUserId = await getEffectiveUserId();
  
  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return null;
  }
  
  const product = await db.product.findUnique({
    where: {
      id,
      userId: effectiveUserId,
    },
    include: {
      category: true,
    },
  });
  
  if (!product) {
    return null;
  }
  
  return {
    ...product,
    price: product.price.toNumber(),
    cost: product.cost ? product.cost.toNumber() : null,
  };
}
