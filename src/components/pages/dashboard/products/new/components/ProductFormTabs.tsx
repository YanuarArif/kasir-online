"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Info,
  Image,
  SlidersHorizontal,
  BarChart,
  ImageIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { ProductFormValues } from "../types";
import { Control } from "react-hook-form";
import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricingInventory from "./ProductPricingInventory";
import ProductImagesSection from "./ProductImagesSection";
import ProductAdvancedOptions from "./ProductAdvancedOptions";

interface ProductFormTabsProps {
  control: Control<ProductFormValues>;
  isPending: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
  previewUrl: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileInputKey: number;
}

const ProductFormTabs: React.FC<ProductFormTabsProps> = ({
  control,
  isPending,
  handleImageUpload,
  isUploading,
  previewUrl,
  fileInputRef,
  fileInputKey,
}) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Informasi Dasar</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Harga & Stok</span>
            <span className="sm:hidden">Harga</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Gambar Produk</span>
            <span className="sm:hidden">Gambar</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <SlidersHorizontalIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Opsi Lanjutan</span>
            <span className="sm:hidden">Lanjutan</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="basic" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar Produk</CardTitle>
            <CardDescription>
              Masukkan informasi dasar produk seperti nama dan deskripsi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductBasicInfo control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pricing" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Harga dan Inventaris</CardTitle>
            <CardDescription>
              Atur harga jual, harga beli, dan stok produk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductPricingInventory control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="images" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Gambar Produk</CardTitle>
            <CardDescription>Unggah dan kelola gambar produk</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductImagesSection
              control={control}
              isPending={isPending}
              handleImageUpload={handleImageUpload}
              isUploading={isUploading}
              previewUrl={previewUrl}
              fileInputRef={fileInputRef}
              fileInputKey={fileInputKey}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="advanced" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Opsi Lanjutan</CardTitle>
            <CardDescription>
              Pengaturan tambahan untuk produk seperti kategori, varian, dan
              barcode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductAdvancedOptions control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProductFormTabs;
