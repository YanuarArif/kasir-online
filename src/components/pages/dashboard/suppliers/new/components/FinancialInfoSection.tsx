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
import { SupplierFormValues } from "../types";
import { 
  CreditCard, 
  Calendar, 
  Building, 
  CreditCardIcon, 
  User 
} from "lucide-react";

interface FinancialInfoSectionProps {
  control: Control<SupplierFormValues>;
  isPending: boolean;
}

const FinancialInfoSection: React.FC<FinancialInfoSectionProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="space-y-6">
      {/* Payment Terms */}
      <FormField
        control={control}
        name="paymentTerms"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-purple-600" />
              Syarat Pembayaran
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Contoh: Net 30, COD, dll."
                {...field}
                disabled={isPending}
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </FormControl>
            <FormDescription>
              Syarat pembayaran yang disepakati dengan supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Bank Information */}
      <div className="space-y-4 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Building className="h-4 w-4 text-purple-600" />
          Informasi Bank
        </h3>
        
        <FormField
          control={control}
          name="bankInfo.bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Building className="h-3 w-3 text-purple-600" />
                Nama Bank
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: BCA, Mandiri, BNI, dll."
                  {...field}
                  disabled={isPending}
                  className="border-purple-100 focus-visible:ring-purple-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="bankInfo.accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <CreditCardIcon className="h-3 w-3 text-purple-600" />
                Nomor Rekening
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nomor rekening"
                  {...field}
                  disabled={isPending}
                  className="border-purple-100 focus-visible:ring-purple-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="bankInfo.accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <User className="h-3 w-3 text-purple-600" />
                Nama Pemilik Rekening
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama pemilik rekening"
                  {...field}
                  disabled={isPending}
                  className="border-purple-100 focus-visible:ring-purple-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Rating */}
      <FormField
        control={control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              Rating Supplier (0-5)
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.5"
                placeholder="Rating 0-5"
                {...field}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 && value <= 5) {
                    field.onChange(value);
                  }
                }}
                disabled={isPending}
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </FormControl>
            <FormDescription>
              Rating kinerja supplier berdasarkan pengalaman sebelumnya
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FinancialInfoSection;
