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
import { Button } from "@/components/ui/button";
import { ProductFormValues } from "../types";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImagesSectionProps {
  control: Control<ProductFormValues>;
  isPending: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
  previewUrl: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileInputKey: number;
}

const ProductImagesSection: React.FC<ProductImagesSectionProps> = ({
  control,
  isPending,
  handleImageUpload,
  isUploading,
  previewUrl,
  fileInputRef,
  fileInputKey,
}) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gambar Produk (Opsional)</FormLabel>
            <FormDescription>
              Unggah gambar produk untuk ditampilkan kepada pelanggan. Format
              yang didukung: JPG, PNG, GIF.
            </FormDescription>

            {/* Hidden field for the image URL */}
            <input type="hidden" {...field} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Upload Area */}
              <div className="space-y-4">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center",
                    "hover:border-primary/50 transition-colors cursor-pointer",
                    "bg-muted/50"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Klik untuk mengunggah gambar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      atau seret dan lepas file di sini
                    </p>
                  </div>

                  {/* Hidden file input */}
                  <FormControl>
                    <Input
                      key={fileInputKey}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      disabled={isPending || isUploading}
                      className="hidden"
                    />
                  </FormControl>
                </div>

                {isUploading && (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Mengunggah...
                    </span>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  <p>Ukuran maksimum: 5MB</p>
                  <p>Resolusi yang disarankan: 1000x1000 piksel</p>
                </div>
              </div>

              {/* Preview Area */}
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium mb-2">Pratinjau Gambar</div>
                <div className="relative w-full h-48 md:h-64 border rounded-md overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                  {previewUrl ? (
                    <>
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                          field.onChange("");
                        }}
                        disabled={isPending || !previewUrl}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Tidak ada gambar
                    </div>
                  )}
                </div>
              </div>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductImagesSection;
