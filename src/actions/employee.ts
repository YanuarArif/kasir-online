"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  CreateEmployeeSchema,
  EmployeeLoginSchema,
  UpdateEmployeeNameSchema,
  UpdateEmployeePasswordSchema,
} from "@/schemas/zod";
import { db } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

/**
 * Create a new employee (karyawan) for the company
 */
export const createEmployee = async (
  values: z.infer<typeof CreateEmployeeSchema>
) => {
  try {
    // Get current session
    const session = await auth();
    const currentUser = session?.user;

    // Check if user is authenticated and is an OWNER
    if (!currentUser || !currentUser.id) {
      return { error: "Tidak terautentikasi!" };
    }

    if (currentUser.role !== Role.OWNER) {
      return { error: "Hanya pemilik yang dapat menambahkan karyawan!" };
    }

    // Validate input
    const validatedFields = CreateEmployeeSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Input tidak valid!" };
    }

    const { name, employeeId, password, role } = validatedFields.data;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if employee ID already exists for this owner
    const existingEmployee = await db.employee.findFirst({
      where: {
        employeeId,
        ownerId: currentUser.id,
      },
    });

    if (existingEmployee) {
      return { error: "ID karyawan sudah digunakan!" };
    }

    // Get the owner's username from the database
    const owner = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        username: true,
      },
    });

    if (!owner || !owner.username) {
      return { error: "Data pemilik tidak lengkap!" };
    }

    // Create the employee
    const employee = await db.employee.create({
      data: {
        name,
        employeeId,
        password: hashedPassword,
        role: role === "ADMIN" ? Role.ADMIN : Role.CASHIER,
        ownerId: currentUser.id,
        ownerUsername: owner.username,
      },
    });

    return {
      success: "Karyawan berhasil ditambahkan!",
      employee: {
        id: employee.id,
        name: employee.name,
        employeeId: employee.employeeId,
        role: employee.role,
      },
    };
  } catch (error) {
    console.error("Error creating employee:", error);
    return { error: "Terjadi kesalahan saat menambahkan karyawan!" };
  }
};

/**
 * Login as an employee
 */
export const employeeLogin = async (
  values: z.infer<typeof EmployeeLoginSchema>
) => {
  try {
    // Validate input
    const validatedFields = EmployeeLoginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Input tidak valid!" };
    }

    const { companyUsername, employeeId, password } = validatedFields.data;

    // Find the employee
    const employee = await db.employee.findFirst({
      where: {
        employeeId,
        ownerUsername: companyUsername,
      },
      include: {
        owner: true,
      },
    });

    if (!employee) {
      return { error: "Karyawan tidak ditemukan!" };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return { error: "Password salah!" };
    }

    // Create a custom token for the employee
    try {
      // Create a JWT token with employee data
      const token = await signIn("employee-credentials", {
        redirect: false,
        employeeId,
        companyUsername,
        password,
      });

      // Return success
      return {
        success: "Login berhasil!",
        redirectTo: "/dashboard",
      };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "ID karyawan atau password salah!" };
          default:
            return { error: "Ada yang salah!" };
        }
      }

      // Check if this is a redirect error (which is actually a success)
      if (error instanceof Error && error.message?.includes("NEXT_REDIRECT")) {
        return {
          success: "Login berhasil!",
          redirectTo: "/dashboard",
        };
      }

      console.error("Error during employee login:", error);
      return { error: "Terjadi kesalahan saat login!" };
    }
  } catch (error) {
    console.error("Error logging in as employee:", error);
    return { error: "Terjadi kesalahan saat login!" };
  }
};

/**
 * Get all employees for the current owner
 */
export const getEmployees = async () => {
  try {
    // Get current session
    const session = await auth();
    const currentUser = session?.user;

    // Check if user is authenticated and is an OWNER
    if (!currentUser || !currentUser.id) {
      return { error: "Tidak terautentikasi!" };
    }

    if (currentUser.role !== Role.OWNER) {
      return { error: "Hanya pemilik yang dapat melihat daftar karyawan!" };
    }

    // Get all employees for this owner
    const employees = await db.employee.findMany({
      where: {
        ownerId: currentUser.id,
      },
      select: {
        id: true,
        name: true,
        employeeId: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { employees };
  } catch (error) {
    console.error("Error getting employees:", error);
    return { error: "Terjadi kesalahan saat mengambil daftar karyawan!" };
  }
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (employeeId: string) => {
  try {
    // Get current session
    const session = await auth();
    const currentUser = session?.user;

    // Check if user is authenticated and is an OWNER
    if (!currentUser || !currentUser.id) {
      return { error: "Tidak terautentikasi!" };
    }

    if (currentUser.role !== Role.OWNER) {
      return { error: "Hanya pemilik yang dapat menghapus karyawan!" };
    }

    // Check if employee exists and belongs to this owner
    const employee = await db.employee.findFirst({
      where: {
        id: employeeId,
        ownerId: currentUser.id,
      },
    });

    if (!employee) {
      return { error: "Karyawan tidak ditemukan!" };
    }

    // Delete the employee
    await db.employee.delete({
      where: {
        id: employeeId,
      },
    });

    return { success: "Karyawan berhasil dihapus!" };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { error: "Terjadi kesalahan saat menghapus karyawan!" };
  }
};

/**
 * Update employee name and role
 */
export const updateEmployeeName = async (
  employeeId: string,
  values: z.infer<typeof UpdateEmployeeNameSchema>
) => {
  try {
    // Get current session
    const session = await auth();
    const currentUser = session?.user;

    // Check if user is authenticated and is an OWNER
    if (!currentUser || !currentUser.id) {
      return { error: "Tidak terautentikasi!" };
    }

    if (currentUser.role !== Role.OWNER) {
      return { error: "Hanya pemilik yang dapat mengubah data karyawan!" };
    }

    // Validate input
    const validatedFields = UpdateEmployeeNameSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Input tidak valid!" };
    }

    const { name, role } = validatedFields.data;

    // Check if employee exists and belongs to this owner
    const employee = await db.employee.findFirst({
      where: {
        id: employeeId,
        ownerId: currentUser.id,
      },
    });

    if (!employee) {
      return { error: "Karyawan tidak ditemukan!" };
    }

    // Update the employee
    const updatedEmployee = await db.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        name,
        role: role === "ADMIN" ? Role.ADMIN : Role.CASHIER,
      },
    });

    // Revalidate the employees page
    revalidatePath("/dashboard/settings/employees");

    return {
      success: "Data karyawan berhasil diperbarui!",
      employee: {
        id: updatedEmployee.id,
        name: updatedEmployee.name,
        employeeId: updatedEmployee.employeeId,
        role: updatedEmployee.role,
      },
    };
  } catch (error) {
    console.error("Error updating employee:", error);
    return { error: "Terjadi kesalahan saat memperbarui data karyawan!" };
  }
};

/**
 * Update employee password
 */
export const updateEmployeePassword = async (
  employeeId: string,
  values: z.infer<typeof UpdateEmployeePasswordSchema>
) => {
  try {
    // Get current session
    const session = await auth();
    const currentUser = session?.user;

    // Check if user is authenticated and is an OWNER
    if (!currentUser || !currentUser.id) {
      return { error: "Tidak terautentikasi!" };
    }

    if (currentUser.role !== Role.OWNER) {
      return { error: "Hanya pemilik yang dapat mengubah password karyawan!" };
    }

    // Validate input
    const validatedFields = UpdateEmployeePasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: validatedFields.error.errors[0].message };
    }

    const { password } = validatedFields.data;

    // Check if employee exists and belongs to this owner
    const employee = await db.employee.findFirst({
      where: {
        id: employeeId,
        ownerId: currentUser.id,
      },
    });

    if (!employee) {
      return { error: "Karyawan tidak ditemukan!" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the employee password
    await db.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Revalidate the employees page
    revalidatePath("/dashboard/settings/employees");

    return { success: "Password karyawan berhasil diperbarui!" };
  } catch (error) {
    console.error("Error updating employee password:", error);
    return { error: "Terjadi kesalahan saat memperbarui password karyawan!" };
  }
};
