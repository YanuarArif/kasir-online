"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Schema for password update
const PasswordUpdateSchema = z.object({
  currentPassword: z.string().min(1, { message: "Password saat ini wajib diisi" }),
  newPassword: z.string().min(6, { message: "Password baru minimal 6 karakter" }),
  confirmPassword: z.string().min(1, { message: "Konfirmasi password wajib diisi" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password baru dan konfirmasi password tidak sama",
  path: ["confirmPassword"],
});

export const updatePassword = async (values: z.infer<typeof PasswordUpdateSchema>) => {
  try {
    // Get current session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Tidak terautentikasi!" };
    }

    // Validate input
    const validatedFields = PasswordUpdateSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: validatedFields.error.errors[0].message };
    }

    // Get user with password
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return { error: "Pengguna tidak ditemukan atau tidak memiliki password!" };
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      validatedFields.data.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return { error: "Password saat ini tidak valid!" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedFields.data.newPassword, 10);

    // Update user password
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { success: "Password berhasil diperbarui!" };
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: "Gagal memperbarui password." };
  }
};
