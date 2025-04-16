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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceFormValues } from "../types";
import { DeviceType } from "../../types";

interface DeviceInfoSectionProps {
  control: Control<ServiceFormValues>;
  isPending: boolean;
}

const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="deviceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipe Perangkat</FormLabel>
            <Select
              disabled={isPending}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe perangkat" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={DeviceType.LAPTOP}>Laptop</SelectItem>
                <SelectItem value={DeviceType.DESKTOP}>Desktop PC</SelectItem>
                <SelectItem value={DeviceType.PHONE}>Smartphone</SelectItem>
                <SelectItem value={DeviceType.TABLET}>Tablet</SelectItem>
                <SelectItem value={DeviceType.PRINTER}>Printer</SelectItem>
                <SelectItem value={DeviceType.OTHER}>Lainnya</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="deviceBrand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merek Perangkat</FormLabel>
              <FormControl>
                <Input
                  placeholder="Merek Perangkat"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Contoh: Lenovo, HP, Samsung, Apple
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="deviceModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Perangkat</FormLabel>
              <FormControl>
                <Input
                  placeholder="Model Perangkat"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Contoh: ThinkPad X1, Galaxy S21, MacBook Pro
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="deviceSerialNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Seri (Opsional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Nomor Seri Perangkat"
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormDescription>
              Nomor seri atau IMEI perangkat jika tersedia
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DeviceInfoSection;
