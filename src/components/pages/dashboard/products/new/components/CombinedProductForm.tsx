"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info, BarChart, ImageIcon, SlidersHorizontalIcon } from "lucide-react";
import { ProductFormValues } from "../types";
import { Control } from "react-hook-form";
import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricingInventory from "./ProductPricingInventory";
import ProductImagesSection from "./ProductImagesSection";
import ProductAdvancedOptions from "./ProductAdvancedOptions";
import { Separator } from "@/components/ui/separator";

interface CombinedProductFormProps {
  control: Control<ProductFormValues>;
  isPending: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
  previewUrl: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputKey: number;
}

const CombinedProductForm: React.FC<CombinedProductFormProps> = ({
  control,
  isPending,
  handleImageUpload,
  isUploading,
  previewUrl,
  fileInputRef,
  fileInputKey,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulir Produk</CardTitle>
        <CardDescription>
          Lengkapi semua informasi produk di bawah ini
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Informasi Dasar Produk</h3>
          </div>
          <ProductBasicInfo control={control} isPending={isPending} />
        </div>

        <Separator />

        {/* Pricing & Inventory Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Harga dan Inventaris</h3>
          </div>
          <ProductPricingInventory control={control} isPending={isPending} />
        </div>

        <Separator />

        {/* Images Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Gambar Produk</h3>
          </div>
          <ProductImagesSection
            control={control}
            isPending={isPending}
            handleImageUpload={handleImageUpload}
            isUploading={isUploading}
            previewUrl={previewUrl}
            fileInputRef={fileInputRef}
            fileInputKey={fileInputKey}
          />
        </div>

        <Separator />

        {/* Advanced Options Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontalIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Opsi Lanjutan</h3>
          </div>
          <ProductAdvancedOptions control={control} isPending={isPending} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedProductForm;
