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
import {
  PurchaseFormValues,
  Supplier,
} from "@/components/pages/dashboard/purchases/new/types"; // Use alias for types

interface PurchaseInfoSectionProps {
  control: Control<PurchaseFormValues>;
  isPending: boolean;
  suppliers: Supplier[];
}

const PurchaseInfoSection: React.FC<PurchaseInfoSectionProps> = ({
  control,
  isPending,
  suppliers,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Invoice Reference */}
      <FormField
        control={control}
        name="invoiceRef"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Invoice/Referensi</FormLabel>
            <FormControl>
              <Input
                placeholder="Contoh: INV-2024-001"
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Supplier Selection */}
      <FormField
        control={control}
        name="supplierId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supplier</FormLabel>
            <FormControl>
              <select
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
                {...field}
                disabled={isPending}
              >
                <option value="">Pilih Supplier (Opsional)</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PurchaseInfoSection;
