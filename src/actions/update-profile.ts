"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

// Schema for profile update
const ProfileUpdateSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

export const updateProfile = async (
  values: z.infer<typeof ProfileUpdateSchema>
) => {
  try {
    // Get current session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Tidak terautentikasi!" };
    }

    // Validate input
    const validatedFields = ProfileUpdateSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Data tidak valid!" };
    }

    // Update user profile
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        ...validatedFields.data,
      },
    });

    return { success: "Profil berhasil diperbarui!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Gagal memperbarui profil." };
  }
};

export const getUserProfile = async () => {
  try {
    // Get current session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Tidak terautentikasi!" };
    }

    // Get user profile
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        phone: true,
        bio: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    if (!user) {
      return { error: "Pengguna tidak ditemukan!" };
    }

    return { user };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { error: "Gagal mengambil data profil." };
  }
};
