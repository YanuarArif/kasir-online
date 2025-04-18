"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Package, CreditCard } from "lucide-react";
import { SaleFormValues, Product } from "../types";
import { Control, UseFieldArrayRemove } from "react-hook-form";
import SaleCustomerSection from "./SaleCustomerSection";
import SaleItemsHeader from "./SaleItemsHeader";
import SaleItemRow from "./SaleItemRow";
import SalePaymentSection from "./SalePaymentSection";
import { Separator } from "@/components/ui/separator";

interface CombinedSaleFormProps {
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

const CombinedSaleForm: React.FC<CombinedSaleFormProps> = ({
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
    <Card>
      <CardHeader>
        <CardTitle>Form Penjualan</CardTitle>
        <CardDescription>
          Isi semua informasi penjualan dalam satu halaman
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Customer Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Informasi Pelanggan</h3>
          </div>
          <SaleCustomerSection control={control} isPending={isPending} />
        </div>

        <Separator />

        {/* Items Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Item Penjualan</h3>
          </div>
          <div className="space-y-4">
            <SaleItemsHeader
              onAddItem={() =>
                append({ productId: "", quantity: 1, priceAtSale: 0 })
              }
              isPending={isPending}
            />

            {fields.map((field, index) => (
              <SaleItemRow
                key={field.id}
                control={control}
                index={index}
                field={field}
                products={products}
                items={items}
                remove={remove}
                handleProductChange={handleProductChange}
                isPending={isPending}
                canRemove={fields.length > 1}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Payment Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Pembayaran</h3>
          </div>
          <SalePaymentSection 
            control={control} 
            isPending={isPending} 
            totalAmount={totalAmount} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedSaleForm;
