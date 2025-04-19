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
import { Textarea } from "@/components/ui/textarea";
import { ServiceFormValues } from "../types";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProblemDetailsSectionProps {
  control: Control<ServiceFormValues>;
  isPending: boolean;
}

const ProblemDetailsSection: React.FC<ProblemDetailsSectionProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="problemDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deskripsi Masalah</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Jelaskan masalah yang dialami perangkat"
                className="min-h-32 resize-none"
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormDescription>
              Jelaskan masalah secara detail, termasuk kapan masalah mulai
              terjadi
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="estimatedCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimasi Biaya (Rp)</FormLabel>
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
                Estimasi biaya perbaikan (opsional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="estimatedCompletionDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Estimasi Tanggal Selesai</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isPending}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Perkiraan kapan servis akan selesai
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="diagnosisNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catatan Diagnosis (Opsional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Catatan diagnosis awal"
                className="resize-none"
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormDescription>
              Catatan diagnosis awal dari teknisi (jika ada)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProblemDetailsSection;
