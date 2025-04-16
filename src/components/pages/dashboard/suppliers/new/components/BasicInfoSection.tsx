"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SupplierFormValues, supplierCategories } from "../types";
import { Building2, Tag, CheckCircle2 } from "lucide-react";

interface BasicInfoSectionProps {
  control: Control<SupplierFormValues>;
  isPending: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="space-y-6">
      {/* Name Field */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-blue-600" />
              Nama Supplier *
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Masukkan nama supplier"
                {...field}
                disabled={isPending}
                className="border-blue-200 focus-visible:ring-blue-500"
              />
            </FormControl>
            <FormDescription>
              Nama perusahaan atau bisnis supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Supplier Type */}
      <FormField
        control={control}
        name="supplierType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-blue-600" />
              Jenis Supplier
            </FormLabel>
            <Select
              disabled={isPending}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-blue-200 focus-visible:ring-blue-500">
                  <SelectValue placeholder="Pilih jenis supplier" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {supplierCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Jenis produk atau layanan yang disediakan supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Active Status */}
      <FormField
        control={control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-blue-200 p-4">
            <div className="space-y-0.5">
              <FormLabel className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Status Aktif
              </FormLabel>
              <FormDescription>
                Supplier aktif akan muncul di daftar supplier untuk pembelian
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tax ID */}
      <FormField
        control={control}
        name="taxId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              NPWP / Tax ID
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Masukkan NPWP supplier (opsional)"
                {...field}
                disabled={isPending}
                className="border-blue-200 focus-visible:ring-blue-500"
              />
            </FormControl>
            <FormDescription>
              Nomor Pokok Wajib Pajak supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoSection;
