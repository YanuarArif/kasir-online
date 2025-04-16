import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EnhancedCustomerFormValues } from "../types";

interface AddressSectionProps {
  form: UseFormReturn<EnhancedCustomerFormValues>;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold border-b pb-2">Alamat</div>

      {/* Address */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-red-600" />
              Alamat
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Alamat lengkap pelanggan"
                className="resize-none"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
