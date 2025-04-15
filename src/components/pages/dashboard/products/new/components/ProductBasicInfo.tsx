"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormValues } from "../types";

interface ProductBasicInfoProps {
  control: Control<ProductFormValues>;
  isPending: boolean;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Nama Produk */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>
              Nama Produk <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Masukkan nama produk"
                {...field}
                disabled={isPending}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SKU */}
      <FormField
        control={control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU (Opsional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Contoh: BRG001"
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Barcode */}
      <FormField
        control={control}
        name="barcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Barcode (Opsional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Contoh: 8992761123456"
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Deskripsi */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Deskripsi (Opsional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Deskripsi singkat tentang produk..."
                className="resize-y min-h-[120px]"
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductBasicInfo;
