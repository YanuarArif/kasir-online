"use client";

import React from "react";
import { SaleFormValues, Product } from "../types";
import { Control, UseFieldArrayRemove } from "react-hook-form";
import CombinedSaleForm from "./CombinedSaleForm";

interface SaleFormTabsProps {
  control: Control<SaleFormValues>;
  isPending: boolean;
  products: Product[];
  items: SaleFormValues["items"];
  fields: any[];
  append: (value: any) => void;
  remove: UseFieldArrayRemove;
  handleProductChange: (index: number, productId: string) => void;
  totalAmount: number;
}

const SaleFormTabs: React.FC<SaleFormTabsProps> = ({
  control,
  isPending,
  products,
  items,
  fields,
  append,
  remove,
  handleProductChange,
  totalAmount,
}) => {
  return (
    <CombinedSaleForm
      control={control}
      isPending={isPending}
      products={products}
      items={items}
      fields={fields}
      append={append}
      remove={remove}
      handleProductChange={handleProductChange}
      totalAmount={totalAmount}
    />
  );
};

export default SaleFormTabs;
