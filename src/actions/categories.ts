"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getEffectiveUserId } from "@/lib/get-effective-user-id";

// Schema for category validation
const CategorySchema = z.object({
  name: z.string().min(1, "Nama kategori harus diisi"),
});

/**
 * Add a new category
 */
export const addCategory = async (values: z.infer<typeof CategorySchema>) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  // 1. Validate input server-side
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const { name } = validatedFields.data;

  try {
    // Check if category with the same name already exists for this user
    const existingCategory = await db.category.findFirst({
      where: {
        userId,
        name,
      },
    });

    if (existingCategory) {
      return { error: "Kategori dengan nama yang sama sudah ada!" };
    }

    // Create category in database
    const category = await db.category.create({
      data: {
        name,
        userId,
      },
    });

    // Revalidate the products page cache
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/products/new");
    revalidatePath("/dashboard/products/edit");

    return { 
      success: "Kategori berhasil ditambahkan!",
      category
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal menambahkan kategori ke database." };
  }
};

/**
 * Get all categories for the current user
 */
export const getCategories = async () => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    // Fetch all categories for the current user or their owner
    const categories = await db.category.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Gagal mengambil data kategori." };
  }
};
