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
    .nonnegative({ message: "Harga jual tidak boleh negatif" })
    .default(0),
  cost: z.coerce
    .number({ invalid_type_error: "Harga beli harus berupa angka" })
    .nonnegative({ message: "Harga beli tidak boleh negatif" })
    .default(0),
  stock: z.coerce
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int({ message: "Stok harus berupa bilangan bulat" })
    .nonnegative({ message: "Stok tidak boleh negatif" })
    .default(0),
  image: z.string().optional().default(""),
});

// Schema for sale item (individual product in a sale)
export const SaleItemSchema = z.object({
  productId: z.string().min(1, { message: "Produk wajib dipilih" }),
  quantity: z.coerce
    .number({ invalid_type_error: "Jumlah harus berupa angka" })
    .int({ message: "Jumlah harus berupa bilangan bulat" })
    .positive({ message: "Jumlah harus lebih dari 0" }),
  priceAtSale: z.coerce
    .number({ invalid_type_error: "Harga jual harus berupa angka" })
    .positive({ message: "Harga jual harus positif" }),
});

// Schema for the entire sale
export const SaleSchema = z.object({
  items: z
    .array(SaleItemSchema)
    .min(1, { message: "Minimal satu produk harus dipilih" }),
  totalAmount: z.coerce
    .number({ invalid_type_error: "Total harus berupa angka" })
    .positive({ message: "Total harus positif" }),
});

// Schema for purchase item (individual product in a purchase)
export const PurchaseItemSchema = z.object({
  productId: z.string().min(1, { message: "Produk wajib dipilih" }),
  quantity: z.coerce
    .number({ invalid_type_error: "Jumlah harus berupa angka" })
    .int({ message: "Jumlah harus berupa bilangan bulat" })
    .positive({ message: "Jumlah harus lebih dari 0" }),
  costAtPurchase: z.coerce
    .number({ invalid_type_error: "Harga beli harus berupa angka" })
    .positive({ message: "Harga beli harus positif" }),
});

// Schema for the entire purchase
export const PurchaseSchema = z.object({
  items: z
    .array(PurchaseItemSchema)
    .min(1, { message: "Minimal satu produk harus dipilih" }),
  totalAmount: z.coerce
    .number({ invalid_type_error: "Total harus berupa angka" })
    .positive({ message: "Total harus positif" }),
  invoiceRef: z.string().optional(),
  supplierId: z.string().optional(),
});

export const CustomerSchema = z.object({
  name: z.string().min(1, { message: "Nama pelanggan wajib diisi" }),
  contactName: z.string().optional(),
  email: z.string().email({ message: "Email tidak valid" }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const SupplierSchema = z.object({
  name: z.string().min(1, { message: "Nama supplier wajib diisi" }),
  contactName: z.string().optional(),
  email: z.string().email({ message: "Email tidak valid" }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const DaftarSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});
