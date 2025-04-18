import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Tag, CreditCard, UserCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { customerCategories } from "../../types";
import { EnhancedCustomerFormValues } from "../types";

interface CustomerInfoSectionProps {
  form: UseFormReturn<EnhancedCustomerFormValues>;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  form,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold border-b pb-2">
        Informasi Pelanggan
      </div>

      {/* Customer Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Building className="h-4 w-4 text-purple-600" />
              Nama Pelanggan *
            </FormLabel>
            <FormControl>
              <Input placeholder="Nama pelanggan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* NIK (Indonesian National ID) */}
      <FormField
        control={form.control}
        name="NIK"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-blue-600" />
              NIK (Nomor Induk Kependudukan)
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan NIK" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* NPWP (Indonesian Tax ID) */}
      <FormField
        control={form.control}
        name="NPWP"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-green-600" />
              NPWP (Nomor Pokok Wajib Pajak)
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan NPWP" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Customer Category */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-yellow-600" />
              Kategori
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori pelanggan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customerCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
