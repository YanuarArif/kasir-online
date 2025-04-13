"use server";

import { z } from "zod";
import { SupplierSchema } from "@/schemas/zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Import auth to get session
import { getEffectiveUserId } from "@/lib/get-effective-user-id";

export const addSupplier = async (values: z.infer<typeof SupplierSchema>) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  // 1. Validate input server-side
  const validatedFields = SupplierSchema.safeParse(values);

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
    // 2. Create the supplier in the database
    const supplier = await db.supplier.create({
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

    // 3. Revalidate the suppliers page to show the new supplier
    revalidatePath("/dashboard/suppliers");

    return { success: "Supplier berhasil ditambahkan!", supplier };
  } catch (error) {
    console.error("Error adding supplier:", error);
    return { error: "Gagal menambahkan supplier. Silakan coba lagi." };
  }
};

export const getSuppliers = async () => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    // Fetch all suppliers for the current user or their owner
    const suppliers = await db.supplier.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { suppliers };
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return { error: "Gagal mengambil data supplier." };
  }
};

export const getSupplierById = async (id: string) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    // Fetch the supplier by ID, ensuring it belongs to the current user or their owner
    const supplier = await db.supplier.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!supplier) {
      return { error: "Supplier tidak ditemukan." };
    }

    return { supplier };
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return { error: "Gagal mengambil data supplier." };
  }
};

export const updateSupplier = async (
  id: string,
  values: z.infer<typeof SupplierSchema>
) => {
  // Get current session
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = user.id;

  // 1. Validate input server-side
  const validatedFields = SupplierSchema.safeParse(values);

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
    // 2. Update the supplier in the database
    const supplier = await db.supplier.update({
      where: {
        id,
        userId, // Ensure the supplier belongs to the current user
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

    // 3. Revalidate the suppliers page to show the updated supplier
    revalidatePath("/dashboard/suppliers");
    revalidatePath(`/dashboard/suppliers/${id}`);

    return { success: "Supplier berhasil diperbarui!", supplier };
  } catch (error) {
    console.error("Error updating supplier:", error);
    return { error: "Gagal memperbarui supplier. Silakan coba lagi." };
  }
};

export const deleteSupplier = async (id: string) => {
  // Get current session
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = user.id;

  try {
    // Delete the supplier from the database
    await db.supplier.delete({
      where: {
        id,
        userId, // Ensure the supplier belongs to the current user
      },
    });

    // Revalidate the suppliers page to remove the deleted supplier
    revalidatePath("/dashboard/suppliers");

    return { success: "Supplier berhasil dihapus!" };
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return { error: "Gagal menghapus supplier. Silakan coba lagi." };
  }
};
