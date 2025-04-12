"use server";

import { Role } from "@prisma/client";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hasRoleLevel } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

/**
 * Change a user's role
 * @param userId ID of the user to update
 * @param newRole New role to assign
 * @returns Object with success or error message
 */
export async function changeUserRole(userId: string, newRole: Role) {
  try {
    // Get current session
    const session = await auth();
    const currentUser = session?.user;

    // Check if user is authenticated
    if (!currentUser || !currentUser.id) {
      return { error: "Tidak terautentikasi!" };
    }

    // Check if current user has permission to change roles
    // Only OWNER can change roles to OWNER or ADMIN
    // Only OWNER or ADMIN can change roles to CASHIER
    const currentUserRole = currentUser.role as Role;

    // Get the user to update
    const userToUpdate = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!userToUpdate) {
      return { error: "Pengguna tidak ditemukan!" };
    }

    // Check if current user has sufficient role level
    if (!hasRoleLevel(currentUserRole, Role.ADMIN)) {
      return { error: "Tidak memiliki izin untuk mengubah peran pengguna!" };
    }

    // OWNER can change any role
    // ADMIN can only change to CASHIER
    if (currentUserRole !== Role.OWNER && newRole !== Role.CASHIER) {
      return { error: "Tidak memiliki izin untuk menetapkan peran ini!" };
    }

    // Update the user's role
    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/settings/users");
    revalidatePath(`/dashboard/settings/users/${userId}`);

    return { success: "Peran pengguna berhasil diubah!" };
  } catch (error) {
    console.error("Error changing user role:", error);
    return { error: "Terjadi kesalahan saat mengubah peran pengguna!" };
  }
}

/**
 * Get all users (for admin panel)
 * @returns Object with users array or error message
 */
export async function getUsers() {
  try {
    // Get current session
    const session = await auth();
    const currentUser = session?.user;

    // Check if user is authenticated
    if (!currentUser || !currentUser.id) {
      return { error: "Tidak terautentikasi!" };
    }

    // Check if current user has permission to view users
    const currentUserRole = currentUser.role as Role;

    if (!hasRoleLevel(currentUserRole, Role.ADMIN)) {
      return { error: "Tidak memiliki izin untuk melihat daftar pengguna!" };
    }

    // Get all users
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
      },
    });

    return { users };
  } catch (error) {
    console.error("Error getting users:", error);
    return { error: "Terjadi kesalahan saat mengambil daftar pengguna!" };
  }
}
