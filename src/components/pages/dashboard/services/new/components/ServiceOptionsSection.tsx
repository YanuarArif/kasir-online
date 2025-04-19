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
import { ServiceFormValues, priorityLevelOptions } from "../types";

interface ServiceOptionsSectionProps {
  control: Control<ServiceFormValues>;
  isPending: boolean;
}

const ServiceOptionsSection: React.FC<ServiceOptionsSectionProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="warrantyPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Masa Garansi (Hari)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="0"
                  {...field}
                  onChange={(e) => {
                    // Only allow numeric input (digits only)
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    // Update the input value with the sanitized value
                    e.target.value = value;
                    // Parse the sanitized value as a number for the form state
                    const numericValue = parseInt(value);
                    field.onChange(isNaN(numericValue) ? 0 : numericValue);
                  }}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Berapa lama garansi servis berlaku (0 = tidak ada garansi)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="priorityLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prioritas</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih level prioritas" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorityLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Level prioritas penanganan servis
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="repairNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catatan Perbaikan (Opsional)</FormLabel>
            <FormControl>
              <textarea
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Catatan tambahan untuk teknisi"
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormDescription>
              Catatan tambahan untuk teknisi atau instruksi khusus
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ServiceOptionsSection;
