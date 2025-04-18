"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Package, CreditCard, Box } from "lucide-react";
import { PurchaseFormValues, Product, Supplier } from "../types";
import { Control, UseFieldArrayRemove } from "react-hook-form";
import PurchaseInfoSection from "./PurchaseInfoSection";
import PurchaseItemsHeader from "./PurchaseItemsHeader";
import PurchaseItemRow from "./PurchaseItemRow";
import PurchasePaymentSection from "./PurchasePaymentSection";
import PurchaseDeliverySection from "./PurchaseDeliverySection";
import { Separator } from "@/components/ui/separator";

interface CombinedPurchaseFormProps {
  control: Control<PurchaseFormValues>;
  isPending: boolean;
  products: Product[];
  suppliers: Supplier[];
  items: PurchaseFormValues["items"];
  fields: any[];
  append: (value: any) => void;
  remove: UseFieldArrayRemove;
  handleProductChange: (index: number, productId: string) => void;
  totalAmount: number;
}

const CombinedPurchaseForm: React.FC<CombinedPurchaseFormProps> = ({
  control,
  isPending,
  products,
  suppliers,
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
        <CardTitle>Formulir Pembelian</CardTitle>
        <CardDescription>
          Lengkapi semua informasi pembelian di bawah ini
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Supplier Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Informasi Supplier</h3>
          </div>
          <PurchaseInfoSection
            control={control}
            isPending={isPending}
            suppliers={suppliers}
          />
        </div>

        <Separator />

        {/* Items Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Item Pembelian</h3>
          </div>
          <div className="space-y-4">
            <PurchaseItemsHeader
              onAddItem={() =>
                append({ productId: "", quantity: 1, costAtPurchase: 0 })
              }
              isPending={isPending}
            />

            {fields.map((field, index) => (
              <PurchaseItemRow
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
            <h3 className="text-lg font-medium">Informasi Pembayaran</h3>
          </div>
          <PurchasePaymentSection
            control={control}
            isPending={isPending}
            totalAmount={totalAmount}
          />
        </div>

        <Separator />

        {/* Delivery Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Box className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Informasi Pengiriman</h3>
          </div>
          <PurchaseDeliverySection control={control} isPending={isPending} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedPurchaseForm;
