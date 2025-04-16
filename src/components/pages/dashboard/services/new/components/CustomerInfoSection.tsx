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
import { ServiceFormValues } from "../types";

interface CustomerInfoSectionProps {
  control: Control<ServiceFormValues>;
  isPending: boolean;
}

const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="serviceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Servis</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nomor Servis"
                  {...field}
                  disabled={true}
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </FormControl>
              <FormDescription>
                Nomor servis dibuat otomatis oleh sistem
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pelanggan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nama Pelanggan"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="customerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nomor Telepon"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="customerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  type="email"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Pelanggan (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="ID Pelanggan"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Untuk pelanggan yang sudah terdaftar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="customerAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat (Opsional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Alamat Pelanggan"
                className="resize-none"
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

export default CustomerInfoSection;
