import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Phone, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EnhancedCustomerFormValues } from "../types";

interface ContactInfoSectionProps {
  form: UseFormReturn<EnhancedCustomerFormValues>;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  form,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold border-b pb-2">
        Informasi Kontak
      </div>

      {/* Contact Name */}
      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-blue-600" />
              Nama Kontak
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Nama kontak pelanggan"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-green-600" />
              Email (Opsional)
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="email@example.com"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-orange-600" />
              Telepon
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Nomor telepon pelanggan"
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
