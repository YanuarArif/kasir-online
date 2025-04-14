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
  needsApproval?: boolean;
  lowStock?: boolean;
  categoryId?: string;
}) {
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return [];
  }

  // Build the query
  const where: any = {
    userId: effectiveUserId,
  };

  // Handle stock filtering
  if (!options?.includeOutOfStock) {
    where.stock = { gt: 0 };
  }

  // Handle low stock filtering (products with stock <= 5)
  if (options?.lowStock) {
    where.stock = { gt: 0, lte: 5 };
  }

  // Handle needs approval filtering (placeholder - you might need to add a field to the schema)
  if (options?.needsApproval) {
    // This is a placeholder. In a real implementation, you would have a field like 'needsApproval'
    // where.needsApproval = true;
  }

  // Filter by category if provided
  if (options?.categoryId) {
    where.categoryId = options.categoryId;
  }

  // Set up ordering
  const orderField = options?.orderBy || "createdAt";
  const orderDirection = options?.orderDirection || "desc";

  // Execute the query
  const products = await db.product.findMany({
    where,
    orderBy: {
      [orderField]: orderDirection,
    },
    include: {
      category: true, // Include category information
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

/**
 * Gets product counts by stock status
 * @returns Object with counts for available, low, and out of stock products
 */
export async function getProductStockCounts() {
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return { available: 0, low: 0, outOfStock: 0, needsApproval: 0 };
  }

  // Count products with stock > 5 (available)
  const availableCount = await db.product.count({
    where: {
      userId: effectiveUserId,
      stock: { gt: 5 },
    },
  });

  // Count products with 0 < stock <= 5 (low stock)
  const lowStockCount = await db.product.count({
    where: {
      userId: effectiveUserId,
      stock: { gt: 0, lte: 5 },
    },
  });

  // Count products with stock = 0 (out of stock)
  const outOfStockCount = await db.product.count({
    where: {
      userId: effectiveUserId,
      stock: 0,
    },
  });

  // For needs approval, this is a placeholder
  // In a real implementation, you would have a field like 'needsApproval'
  const needsApprovalCount = 0;

  return {
    available: availableCount,
    low: lowStockCount,
    outOfStock: outOfStockCount,
    needsApproval: needsApprovalCount,
  };
}
