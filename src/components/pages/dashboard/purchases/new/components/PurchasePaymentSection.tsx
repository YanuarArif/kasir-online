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
import { PurchaseFormValues } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, X, HelpCircle } from "lucide-react";

interface PurchasePaymentSectionProps {
  control: Control<PurchaseFormValues>;
  isPending: boolean;
  totalAmount: number;
}

const PurchasePaymentSection: React.FC<PurchasePaymentSectionProps> = ({
  control,
  isPending,
  totalAmount,
}) => {
  // Payment status options
  const paymentStatusOptions = [
    { id: "paid", name: "Lunas", icon: <Check className="h-3 w-3 mr-1" /> },
    {
      id: "pending",
      name: "Belum Dibayar",
      icon: <X className="h-3 w-3 mr-1" />,
    },
    {
      id: "partial",
      name: "Sebagian",
      icon: <HelpCircle className="h-3 w-3 mr-1" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informasi Pembayaran</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Status */}
        <FormField
          control={control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Pembayaran</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status pembayaran" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentStatusOptions.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      <div className="flex items-center">
                        {status.icon}
                        {status.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Due Date - Only show if status is not "paid" */}
        {control._formValues.paymentStatus !== "paid" && (
          <FormField
            control={control}
            name="paymentDueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Jatuh Tempo</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      field.onChange(date);
                    }}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  Tanggal jatuh tempo pembayaran
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Payment Summary */}
      <div className="bg-muted/50 rounded-lg p-4 mt-4">
        <h4 className="text-sm font-medium mb-3">Ringkasan Pembayaran</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Subtotal:</span>
            <span className="font-medium">
              Rp {totalAmount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Pajak (0%):</span>
            <span className="font-medium">Rp 0</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-lg font-bold">
              Rp {totalAmount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-end mt-2">
            {control._formValues.paymentStatus === "paid" && (
              <Badge className="bg-green-500">
                <Check className="h-3 w-3 mr-1" />
                Lunas
              </Badge>
            )}
            {control._formValues.paymentStatus === "pending" && (
              <Badge variant="destructive">
                <X className="h-3 w-3 mr-1" />
                Belum Dibayar
              </Badge>
            )}
            {control._formValues.paymentStatus === "partial" && (
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Sebagian
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePaymentSection;
