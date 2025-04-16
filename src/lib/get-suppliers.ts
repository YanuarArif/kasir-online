"use server";

import { db } from "@/lib/prisma";
import { getEffectiveUserId } from "./get-effective-user-id";

/**
 * Fetches suppliers for the current user or their owner if they're an employee
 * @returns Array of suppliers or empty array if not authenticated
 */
export async function getSuppliers() {
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return { suppliers: [], error: "Tidak terautentikasi!" };
  }

  try {
    const suppliers = await db.supplier.findMany({
      where: {
        userId: effectiveUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { suppliers, error: null };
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return { suppliers: [], error: "Gagal mengambil data supplier." };
  }
}

/**
 * Fetches a single supplier by ID
 * @param id Supplier ID
 * @returns Supplier object or null if not found
 */
export async function getSupplierById(id: string) {
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return null;
  }

  try {
    const supplier = await db.supplier.findUnique({
      where: {
        id,
        userId: effectiveUserId,
      },
    });

    return supplier;
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return null;
  }
}
