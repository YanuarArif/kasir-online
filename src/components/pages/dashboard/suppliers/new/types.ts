import { z } from "zod";
import { SupplierSchema } from "@/schemas/zod";

// Extend the base SupplierSchema with additional fields for the enhanced UI
export const EnhancedSupplierSchema = SupplierSchema.extend({
  // Additional fields for the enhanced UI
  website: z.string().url({ message: "URL website tidak valid" }).optional().or(z.literal("")),
  taxId: z.string().optional(),
  paymentTerms: z.string().optional(),
  supplierType: z.enum(["product", "service", "both"]).default("product"),
  isActive: z.boolean().default(true),
  rating: z.number().min(0).max(5).optional(),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  bankInfo: z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    accountName: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
});

// Define the type for the form values
export type SupplierFormValues = z.infer<typeof EnhancedSupplierSchema>;

// Define the type for supplier categories
export const supplierCategories = [
  { value: "product", label: "Produk" },
  { value: "service", label: "Jasa" },
  { value: "both", label: "Produk & Jasa" },
];
