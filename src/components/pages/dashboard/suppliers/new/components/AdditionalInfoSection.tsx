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
import { FileText, Tag, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdditionalInfoSectionProps {
  control: Control<SupplierFormValues>;
  isPending: boolean;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  control,
  isPending,
}) => {
  // For handling tags input
  const [tagInput, setTagInput] = React.useState("");

  return (
    <div className="space-y-6">
      {/* Notes */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-amber-600" />
              Catatan
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Masukkan catatan tambahan tentang supplier"
                {...field}
                disabled={isPending}
                className="min-h-32 border-amber-200 focus-visible:ring-amber-500"
              />
            </FormControl>
            <FormDescription>
              Informasi tambahan atau catatan penting tentang supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tags */}
      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-amber-600" />
              Tag
            </FormLabel>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {field.value?.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 hover:text-red-500"
                    onClick={() => {
                      const newTags = [...field.value || []];
                      newTags.splice(index, 1);
                      field.onChange(newTags);
                    }}
                    disabled={isPending}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Tambahkan tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault();
                    const newTags = [...field.value || [], tagInput.trim()];
                    field.onChange(newTags);
                    setTagInput("");
                  }
                }}
                disabled={isPending}
                className="border-amber-200 focus-visible:ring-amber-500"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  if (tagInput.trim()) {
                    const newTags = [...field.value || [], tagInput.trim()];
                    field.onChange(newTags);
                    setTagInput("");
                  }
                }}
                disabled={isPending || !tagInput.trim()}
                className="border-amber-200 hover:bg-amber-100 hover:text-amber-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </div>
            
            <FormDescription>
              Tambahkan tag untuk memudahkan pencarian dan pengelompokan supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalInfoSection;
