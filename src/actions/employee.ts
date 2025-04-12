"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { CreateEmployeeSchema, EmployeeLoginSchema } from "@/schemas/zod";
import { db } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

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

    try {
      // Sign in the employee
      await signIn("employee-credentials", {
        employeeId,
        companyUsername,
        password,
        redirectTo: "/dashboard",
      });

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
      throw error;
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
