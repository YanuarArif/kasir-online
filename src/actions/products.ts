"use server";

import { z } from "zod";
import { ProductSchema } from "@/schemas/zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Import auth to get session
import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { EnhancedProductSchema } from "@/components/pages/dashboard/products/new/types";

export const addProduct = async (
  values: z.infer<typeof EnhancedProductSchema>
) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  // 1. Validate input server-side
  const validatedFields = EnhancedProductSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const { name, description, sku, price, cost, stock, image, categoryId } =
    validatedFields.data;

  try {
    // 2. Create product in database
    await db.product.create({
      data: {
        name,
        description,
        sku,
        price,
        cost,
        stock,
        image,
        userId: userId, // Add the userId
        categoryId: categoryId || null, // Add categoryId if provided
      },
    });

    // 3. Revalidate the products page cache
    revalidatePath("/dashboard/products"); // Revalidate the path to show the new product

    return { success: "Produk berhasil ditambahkan!" };
  } catch (error) {
    console.error("Database Error:", error);
    // Handle specific errors like unique constraint violation if needed
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === "P2002"
    ) {
      // Assuming P2002 is the unique constraint violation code for your DB
      // The target for @@unique([userId, sku]) might be reported differently,
      // adjust if needed based on actual error messages.
      // Often it's reported as ['userId', 'sku'] or similar.
      // Let's keep the general message for now unless specific handling is required.
      if ((error as any).meta?.target?.includes("sku")) {
        return { error: "SKU sudah digunakan untuk pengguna ini!" };
      }
    }
    return { error: "Gagal menambahkan produk ke database." };
  }
};

export const updateProduct = async (
  id: string,
  values: z.infer<typeof EnhancedProductSchema>
) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  // 1. Validate input server-side
  const validatedFields = EnhancedProductSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const { name, description, sku, price, cost, stock, image, categoryId } =
    validatedFields.data;

  try {
    // Check if product exists and belongs to this user
    const existingProduct = await db.product.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingProduct) {
      return { error: "Produk tidak ditemukan!" };
    }

    // 2. Update product in database
    await db.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        sku,
        price,
        cost,
        stock,
        image,
        categoryId: categoryId || null,
      },
    });

    // 3. Revalidate the products page cache
    revalidatePath("/dashboard/products"); // Revalidate the products list
    revalidatePath(`/dashboard/products/${id}`); // Revalidate the product detail page

    return { success: "Produk berhasil diperbarui!" };
  } catch (error) {
    console.error("Database Error:", error);
    // Handle specific errors like unique constraint violation if needed
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === "P2002"
    ) {
      if ((error as any).meta?.target?.includes("sku")) {
        return { error: "SKU sudah digunakan untuk pengguna ini!" };
      }
    }
    return { error: "Gagal memperbarui produk." };
  }
};

export const deleteProduct = async (id: string) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    // Check if product exists and belongs to this user
    const existingProduct = await db.product.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingProduct) {
      return { error: "Produk tidak ditemukan!" };
    }

    // Delete the product
    await db.product.delete({
      where: {
        id,
      },
    });

    // Revalidate the products page cache
    revalidatePath("/dashboard/products");

    return { success: "Produk berhasil dihapus!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal menghapus produk. Silakan coba lagi." };
  }
};
