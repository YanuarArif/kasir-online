"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SaleFormValues } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface SalePaymentSectionProps {
  control: Control<SaleFormValues>;
  isPending: boolean;
  totalAmount: number;
}

const SalePaymentSection: React.FC<SalePaymentSectionProps> = ({
  control,
  isPending,
  totalAmount,
}) => {
  // Payment methods
  const paymentMethods = [
    { id: "cash", name: "Tunai" },
    { id: "transfer", name: "Transfer Bank" },
    { id: "qris", name: "QRIS" },
    { id: "credit_card", name: "Kartu Kredit" },
    { id: "debit_card", name: "Kartu Debit" },
  ];

  // Calculate change
  const amountPaid = control._formValues.amountPaid || 0;
  const change = Math.max(0, amountPaid - totalAmount);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method */}
        <FormField
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metode Pembayaran</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                defaultValue={field.value || "cash"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount Paid */}
        <FormField
          control={control}
          name="amountPaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Dibayar</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="0"
                  {...field}
                  disabled={isPending}
                  onChange={(e) => {
                    // Only allow numeric input (digits and decimal point)
                    const value = e.target.value.replace(/[^0-9.]/g, "");

                    // Prevent multiple decimal points
                    const parts = value.split(".");
                    const sanitizedValue =
                      parts[0] +
                      (parts.length > 1 ? "." + parts.slice(1).join("") : "");

                    // Update the input value to show the sanitized value
                    e.target.value = sanitizedValue;

                    // Convert to number for the form state
                    const numericValue = parseFloat(sanitizedValue);
                    field.onChange(isNaN(numericValue) ? 0 : numericValue);
                  }}
                />
              </FormControl>
              <FormDescription>
                Jumlah yang dibayarkan oleh pelanggan
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Change Amount */}
      {amountPaid > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Kembalian:</span>
            <span className="text-lg font-bold">
              Rp {change.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}

      <Separator />

      {/* Notes */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catatan (Opsional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tambahkan catatan untuk transaksi ini..."
                className="resize-y"
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

export default SalePaymentSection;
