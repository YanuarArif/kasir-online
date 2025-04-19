"use client";

import React from "react";
import { ProductFormValues } from "../types";
import { Control } from "react-hook-form";
import CombinedProductForm from "./CombinedProductForm";

interface ProductFormTabsProps {
  control: Control<ProductFormValues>;
  isPending: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
  previewUrl: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
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
    <CombinedProductForm
      control={control}
      isPending={isPending}
      handleImageUpload={handleImageUpload}
      isUploading={isUploading}
      previewUrl={previewUrl}
      fileInputRef={fileInputRef}
      fileInputKey={fileInputKey}
    />
  );
};

export default ProductFormTabs;
