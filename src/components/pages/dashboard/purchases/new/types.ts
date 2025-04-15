import { z } from "zod";
import { PurchaseSchema } from "@/schemas/zod";

// Extend the base PurchaseSchema with additional fields for the enhanced UI
export const EnhancedPurchaseSchema = PurchaseSchema.extend({
  // Additional fields for the enhanced UI
  deliveryDate: z.date().optional(),
  paymentStatus: z.enum(["paid", "pending", "partial"]).default("paid"),
  paymentDueDate: z.date().optional(),
  attachments: z.array(z.string()).optional(),
  notes: z.string().optional(),
  trackDelivery: z.boolean().default(false),
  notifyOnArrival: z.boolean().default(false),
});

// Define the type for the form values
export type PurchaseFormValues = z.infer<typeof EnhancedPurchaseSchema>;

// Define the type for products and suppliers
export interface Product {
  id: string;
  name: string;
  cost: number | null;
}

export interface Supplier {
  id: string;
  name: string;
}
