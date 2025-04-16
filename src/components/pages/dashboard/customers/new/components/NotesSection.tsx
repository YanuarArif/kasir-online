import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EnhancedCustomerFormValues } from "../types";

interface NotesSectionProps {
  form: UseFormReturn<EnhancedCustomerFormValues>;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold border-b pb-2">Catatan</div>

      {/* Notes */}
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-gray-600" />
              Catatan Tambahan
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Catatan tambahan tentang pelanggan"
                className="resize-none"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
