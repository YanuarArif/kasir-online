import { z } from "zod";
import { SaleSchema } from "@/schemas/zod";

// Define the type for the form values
export type SaleFormValues = z.infer<typeof SaleSchema>;

// Define the type for products specific to sales
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}
