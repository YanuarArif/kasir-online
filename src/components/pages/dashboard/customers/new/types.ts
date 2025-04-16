import { z } from "zod";
import { CustomerSchema } from "@/schemas/zod";

// Extend the base CustomerSchema with additional fields
export const EnhancedCustomerSchema = CustomerSchema.extend({
  category: z.string().optional(),
});

export type EnhancedCustomerFormValues = z.infer<typeof EnhancedCustomerSchema>;
