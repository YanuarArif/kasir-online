import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Nama produk wajib diisi" }),
  description: z.string().optional(),
  sku: z.string().optional(),
  // Use coerce for string inputs from forms that should be numbers
  price: z.coerce
    .number({ invalid_type_error: "Harga jual harus berupa angka" })
    .positive({ message: "Harga jual harus positif" }),
  cost: z.coerce
    .number({ invalid_type_error: "Harga beli harus berupa angka" })
    .nonnegative({ message: "Harga beli tidak boleh negatif" })
    .optional(),
  stock: z.coerce
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int({ message: "Stok harus berupa bilangan bulat" })
    .nonnegative({ message: "Stok tidak boleh negatif" }),
});

export const DaftarSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});
