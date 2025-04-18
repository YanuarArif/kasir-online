"use server";

import { getCustomers } from "@/lib/get-customers";

// This is a server action that can be called from client components
export async function getCustomersAction() {
  try {
    const customers = await getCustomers();
    return { success: true, customers };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { success: false, error: "Failed to fetch customers" };
  }
}
