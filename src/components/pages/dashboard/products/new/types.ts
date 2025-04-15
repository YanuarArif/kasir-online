import { z } from "zod";
import { ProductSchema } from "@/schemas/zod";

// Extend the base ProductSchema with additional fields for the enhanced UI
export const EnhancedProductSchema = ProductSchema.extend({
  // Additional fields for the enhanced UI
  categoryId: z.string().optional(),
  barcode: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  hasVariants: z.boolean().default(false),
  trackInventory: z.boolean().default(true),
  minStockLevel: z.coerce.number().int().nonnegative().optional(),
  weight: z.coerce.number().nonnegative().optional(),
  dimensions: z.object({
    length: z.coerce.number().nonnegative().optional(),
    width: z.coerce.number().nonnegative().optional(),
    height: z.coerce.number().nonnegative().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
});

// Define the type for the form values
export type ProductFormValues = z.infer<typeof EnhancedProductSchema>;

// Define the type for product categories
export interface Category {
  id: string;
  name: string;
}

// Define the type for product tags
export interface Tag {
  id: string;
  name: string;
}
