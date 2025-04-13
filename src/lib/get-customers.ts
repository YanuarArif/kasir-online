"use server";

import { db } from "@/lib/prisma";
import { getEffectiveUserId } from "./get-effective-user-id";

/**
 * Fetches customers for the current user or their owner if they're an employee
 * @returns Array of customers or empty array if not authenticated
 */
export async function getCustomers() {
  const effectiveUserId = await getEffectiveUserId();
  
  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return [];
  }
  
  try {
    const customers = await db.customer.findMany({
      where: {
        userId: effectiveUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

/**
 * Fetches a single customer by ID
 * @param id Customer ID
 * @returns Customer object or null if not found
 */
export async function getCustomerById(id: string) {
  const effectiveUserId = await getEffectiveUserId();
  
  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return null;
  }
  
  try {
    const customer = await db.customer.findUnique({
      where: {
        id,
        userId: effectiveUserId,
      },
    });
    
    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}
