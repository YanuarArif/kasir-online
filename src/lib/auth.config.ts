// this file for edge browser compatible
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db as database } from "./prisma";
import bcrypt from "bcryptjs";
import { LoginSchema, EmployeeLoginSchema } from "../schemas/zod";
import { Role } from "@prisma/client";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    // Provider untuk login dengan email dan password
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        // Validasi input menggunakan schema Zod
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }
        // Ambil email dan password dari data yang sudah divalidasi
        const { email, password } = validatedFields.data;
        // Cari pengguna berdasarkan email
        const user = await database.user.findUnique({
          where: { email },
        });

        // Jika pengguna tidak ditemukan, lempar error
        if (!user || !user.password) {
          throw new Error("User tidak ditemukan atau password salah!");
        }
        // Block login jika email belum diverifikasi
        if (user && !user.emailVerified) {
          throw new Error("Verify your email first! Check your inbox.");
        }

        // Bandingkan password yang dimasukkan dengan hash password di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return {
          ...user,
          role: user.role ?? Role.CASHIER,
        };
      },
    }),

    // Provider untuk login sebagai karyawan
    Credentials({
      id: "employee-credentials",
      name: "Employee Login",
      credentials: {
        companyUsername: { type: "text", label: "Username Perusahaan" },
        employeeId: { type: "text", label: "ID Karyawan" },
        password: { type: "password", label: "Password" },
      },
      async authorize(credentials) {
        // Validasi input menggunakan schema Zod
        const validatedFields = EmployeeLoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        // Ambil data dari input yang sudah divalidasi
        const { companyUsername, employeeId, password } = validatedFields.data;

        // Cari owner berdasarkan username
        const owner = await database.user.findUnique({
          where: { username: companyUsername },
        });

        // Jika owner tidak ditemukan, lempar error
        if (!owner || owner.role !== Role.OWNER) {
          throw new Error("Perusahaan tidak ditemukan!");
        }

        // Cari karyawan berdasarkan employeeId dan ownerId
        const employee = await database.employee.findFirst({
          where: {
            employeeId,
            ownerId: owner.id,
          },
        });

        // Jika karyawan tidak ditemukan, lempar error
        if (!employee) {
          throw new Error("Karyawan tidak ditemukan!");
        }

        // Bandingkan password yang dimasukkan dengan hash password di database
        const isPasswordValid = await bcrypt.compare(
          password,
          employee.password
        );
        if (!isPasswordValid) {
          throw new Error("Password salah!");
        }

        // Return data karyawan dengan format yang sesuai dengan User
        return {
          id: employee.id,
          name: employee.name,
          role: employee.role,
          isEmployee: true,
          ownerId: employee.ownerId,
          employeeId: employee.employeeId,
        };
      },
    }),

    // Provider untuk login dengan Google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
