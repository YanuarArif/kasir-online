import { z } from "zod";
import { SaleSchema } from "@/schemas/zod";

// Extend the base SaleSchema with additional fields for the enhanced UI
export const EnhancedSaleSchema = SaleSchema.extend({
  // Additional fields for the enhanced UI
  customerId: z.string().optional(),
  invoiceRef: z.string().optional(),
  customerNIK: z.string().optional(),
  customerNPWP: z.string().optional(),
  paymentMethod: z.string().default("cash"),
  amountPaid: z.coerce.number().nonnegative().optional(),
  printReceipt: z.boolean().default(true),
  sendReceipt: z.boolean().default(false),
  notes: z.string().optional(),
});

// Define the type for the form values
export type SaleFormValues = z.infer<typeof EnhancedSaleSchema>;

// Define the type for products specific to sales
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// Define the type for customers
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  NIK?: string;
  NPWP?: string;
}
