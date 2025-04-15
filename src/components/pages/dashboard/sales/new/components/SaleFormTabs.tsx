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
import { User, Package, CreditCard } from "lucide-react";
import { SaleFormValues, Product } from "../types";
import { Control, UseFieldArrayRemove } from "react-hook-form";
import SaleCustomerSection from "./SaleCustomerSection";
import SaleItemsHeader from "./SaleItemsHeader";
import SaleItemRow from "./SaleItemRow";
import SalePaymentSection from "./SalePaymentSection";

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
    <Tabs defaultValue="items" className="w-full">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="customer" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Pelanggan</span>
            <span className="sm:hidden">Pelanggan</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Item Penjualan</span>
            <span className="sm:hidden">Item</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pembayaran</span>
            <span className="sm:hidden">Bayar</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="customer" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pelanggan</CardTitle>
            <CardDescription>
              Pilih pelanggan atau tambahkan pelanggan baru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SaleCustomerSection control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="items" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Item Penjualan</CardTitle>
            <CardDescription>
              Tambahkan produk yang dibeli oleh pelanggan
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payment" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pembayaran</CardTitle>
            <CardDescription>
              Pilih metode pembayaran dan masukkan jumlah yang dibayarkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalePaymentSection
              control={control}
              isPending={isPending}
              totalAmount={totalAmount}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SaleFormTabs;
