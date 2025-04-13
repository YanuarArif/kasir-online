"use server";

import { z } from "zod";
import { CustomerSchema } from "@/schemas/zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Import auth to get session
import { getEffectiveUserId } from "@/lib/get-effective-user-id";

export const addCustomer = async (values: z.infer<typeof CustomerSchema>) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  // 1. Validate input server-side
  const validatedFields = CustomerSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const { name, contactName, email, phone, address, notes } =
    validatedFields.data;

  try {
    // 2. Create the customer in the database
    const customer = await db.customer.create({
      data: {
        name,
        contactName,
        email,
        phone,
        address,
        notes,
        userId, // Associate with the current user
      },
    });

    // 3. Revalidate the customers page to show the new customer
    revalidatePath("/dashboard/customers");

    return { success: "Pelanggan berhasil ditambahkan!", customer };
  } catch (error) {
    console.error("Error adding customer:", error);
    return { error: "Gagal menambahkan pelanggan. Silakan coba lagi." };
  }
};

export const getCustomers = async () => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    // Fetch all customers for the current user or their owner
    const customers = await db.customer.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { customers };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { error: "Gagal mengambil data pelanggan." };
  }
};

export const getCustomerById = async (id: string) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    // Fetch the customer by ID, ensuring it belongs to the current user or their owner
    const customer = await db.customer.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!customer) {
      return { error: "Pelanggan tidak ditemukan." };
    }

    return { customer };
  } catch (error) {
    console.error("Error fetching customer:", error);
    return { error: "Gagal mengambil data pelanggan." };
  }
};

export const updateCustomer = async (
  id: string,
  values: z.infer<typeof CustomerSchema>
) => {
  // Get current session
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = user.id;

  // 1. Validate input server-side
  const validatedFields = CustomerSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const { name, contactName, email, phone, address, notes } =
    validatedFields.data;

  try {
    // 2. Update the customer in the database
    const customer = await db.customer.update({
      where: {
        id,
        userId, // Ensure the customer belongs to the current user
      },
      data: {
        name,
        contactName,
        email,
        phone,
        address,
        notes,
      },
    });

    // 3. Revalidate the customers page to show the updated customer
    revalidatePath("/dashboard/customers");
    revalidatePath(`/dashboard/customers/${id}`);

    return { success: "Pelanggan berhasil diperbarui!", customer };
  } catch (error) {
    console.error("Error updating customer:", error);
    return { error: "Gagal memperbarui pelanggan. Silakan coba lagi." };
  }
};

export const deleteCustomer = async (id: string) => {
  // Get current session
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = user.id;

  try {
    // Delete the customer from the database
    await db.customer.delete({
      where: {
        id,
        userId, // Ensure the customer belongs to the current user
      },
    });

    // Revalidate the customers page to remove the deleted customer
    revalidatePath("/dashboard/customers");

    return { success: "Pelanggan berhasil dihapus!" };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { error: "Gagal menghapus pelanggan. Silakan coba lagi." };
  }
};
