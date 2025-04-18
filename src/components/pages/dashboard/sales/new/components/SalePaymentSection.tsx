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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
                  type="number"
                  placeholder="0"
                  {...field}
                  min="0"
                  step="any"
                  disabled={isPending}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    field.onChange(isNaN(value) ? 0 : value);
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

      {/* Additional Options */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Opsi Tambahan</h4>

        <FormField
          control={control}
          name="printReceipt"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Cetak Struk</FormLabel>
                <FormDescription>
                  Cetak struk setelah transaksi selesai
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="sendReceipt"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Kirim Struk</FormLabel>
                <FormDescription>
                  Kirim struk ke email pelanggan
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

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
