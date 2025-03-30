"use server";

import { z } from "zod";
import { ProductSchema } from "@/schemas/zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Import revalidatePath

export const addProduct = async (values: z.infer<typeof ProductSchema>) => {
  // 1. Validate input server-side
  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const { name, description, sku, price, cost, stock } = validatedFields.data;

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
        // categoryId: null, // Explicitly set if needed, otherwise Prisma handles optional
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
      // Assuming P2002 is the unique constraint violation code for your DB (common in Prisma)
      // Check if the target includes 'sku'
      if ((error as any).meta?.target?.includes("sku")) {
        return { error: "SKU sudah digunakan!" };
      }
    }
    return { error: "Gagal menambahkan produk ke database." };
  }
};
