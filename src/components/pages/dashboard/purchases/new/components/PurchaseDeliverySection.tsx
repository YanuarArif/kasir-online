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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PurchaseDeliverySectionProps {
  control: Control<PurchaseFormValues>;
  isPending: boolean;
}

const PurchaseDeliverySection: React.FC<PurchaseDeliverySectionProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informasi Pengiriman</h3>

      {/* Delivery Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="deliveryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Pengiriman (Opsional)</FormLabel>
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
                Tanggal yang diharapkan untuk pengiriman
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tracking Options */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Opsi Pelacakan</h4>

        <FormField
          control={control}
          name="trackDelivery"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Lacak Pengiriman</FormLabel>
                <FormDescription>
                  Aktifkan untuk melacak status pengiriman
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
          name="notifyOnArrival"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Notifikasi Kedatangan
                </FormLabel>
                <FormDescription>
                  Dapatkan notifikasi saat pesanan tiba
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

      {/* Attachments */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Lampiran</h4>
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/50">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Klik untuk mengunggah dokumen</p>
            <p className="text-xs text-muted-foreground">
              atau seret dan lepas file di sini
            </p>
          </div>
          <Button variant="outline" className="mt-4" disabled={isPending}>
            <Upload className="h-4 w-4 mr-2" />
            Pilih File
          </Button>
        </div>
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
                placeholder="Tambahkan catatan untuk pembelian ini..."
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

export default PurchaseDeliverySection;
