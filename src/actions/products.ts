"use server";

import { z } from "zod";
import { ProductSchema } from "@/schemas/zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Import auth to get session

export const addProduct = async (values: z.infer<typeof ProductSchema>) => {
  // Get current session
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = user.id;

  // 1. Validate input server-side
  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const { name, description, sku, price, cost, stock, image } =
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
        // categoryId: null,
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
