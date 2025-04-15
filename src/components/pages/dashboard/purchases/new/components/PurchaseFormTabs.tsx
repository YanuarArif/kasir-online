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
import { User, Package, CreditCard, Box } from "lucide-react";
import { PurchaseFormValues, Product, Supplier } from "../types";
import { Control, UseFieldArrayRemove } from "react-hook-form";
import PurchaseInfoSection from "./PurchaseInfoSection";
import PurchaseItemsHeader from "./PurchaseItemsHeader";
import PurchaseItemRow from "./PurchaseItemRow";
import PurchasePaymentSection from "./PurchasePaymentSection";
import PurchaseDeliverySection from "./PurchaseDeliverySection";

interface PurchaseFormTabsProps {
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

const PurchaseFormTabs: React.FC<PurchaseFormTabsProps> = ({
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
    <Tabs defaultValue="supplier" className="w-full">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="supplier" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Supplier</span>
            <span className="sm:hidden">Supplier</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Item Pembelian</span>
            <span className="sm:hidden">Item</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pembayaran</span>
            <span className="sm:hidden">Bayar</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            <span className="hidden sm:inline">Pengiriman</span>
            <span className="sm:hidden">Kirim</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="supplier" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Supplier</CardTitle>
            <CardDescription>
              Pilih supplier dan masukkan informasi faktur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurchaseInfoSection
              control={control}
              isPending={isPending}
              suppliers={suppliers}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="items" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Item Pembelian</CardTitle>
            <CardDescription>
              Tambahkan produk yang dibeli dari supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payment" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pembayaran</CardTitle>
            <CardDescription>
              Atur status pembayaran dan tanggal jatuh tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurchasePaymentSection
              control={control}
              isPending={isPending}
              totalAmount={totalAmount}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="delivery" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pengiriman</CardTitle>
            <CardDescription>
              Atur tanggal pengiriman dan opsi pelacakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurchaseDeliverySection control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PurchaseFormTabs;
