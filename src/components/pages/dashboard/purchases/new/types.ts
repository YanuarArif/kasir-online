import { z } from "zod";
import { PurchaseSchema } from "@/schemas/zod";

// Define the type for the form values
export type PurchaseFormValues = z.infer<typeof PurchaseSchema>;

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
