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
import { Switch } from "@/components/ui/switch";
import { ProductFormValues } from "../types";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductPricingInventoryProps {
  control: Control<ProductFormValues>;
  isPending: boolean;
}

const ProductPricingInventory: React.FC<ProductPricingInventoryProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="space-y-8">
      {/* Pricing Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Informasi Harga</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Harga Jual */}
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Harga Jual (Rp) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    min="0"
                    step="any"
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  Harga yang akan ditampilkan kepada pelanggan
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Harga Beli */}
          <FormField
            control={control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Beli (Rp) (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    min="0"
                    step="any"
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  Harga pembelian dari supplier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tax Rate */}
          <FormField
            control={control}
            name="taxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarif Pajak (%) (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    min="0"
                    max="100"
                    step="0.1"
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  Persentase pajak yang dikenakan pada produk
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Inventory Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Manajemen Inventaris</h3>
        
        {/* Track Inventory Switch */}
        <FormField
          control={control}
          name="trackInventory"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Lacak Inventaris</FormLabel>
                <FormDescription>
                  Aktifkan untuk melacak stok produk ini
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Stok Awal */}
          <FormField
            control={control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Stok Awal <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    min="0"
                    step="1"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Min Stock Level */}
          <FormField
            control={control}
            name="minStockLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batas Minimum Stok (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    min="0"
                    step="1"
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  Jumlah minimum stok sebelum notifikasi dikirim
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Profit Calculation Card */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Kalkulasi Keuntungan</CardTitle>
          <CardDescription>
            Perhitungan keuntungan berdasarkan harga jual dan harga beli
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfitCalculator control={control} />
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component to calculate and display profit
const ProfitCalculator = ({ control }: { control: Control<ProductFormValues> }) => {
  const [profit, setProfit] = React.useState({ amount: 0, percentage: 0 });
  
  // Watch for price and cost changes
  const price = control._formValues.price as number || 0;
  const cost = control._formValues.cost as number || 0;
  
  React.useEffect(() => {
    if (price > 0 && cost > 0) {
      const profitAmount = price - cost;
      const profitPercentage = (profitAmount / cost) * 100;
      setProfit({
        amount: profitAmount,
        percentage: profitPercentage,
      });
    } else {
      setProfit({ amount: 0, percentage: 0 });
    }
  }, [price, cost]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm">Harga Jual:</span>
        <span className="font-medium">Rp {price.toLocaleString('id-ID')}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm">Harga Beli:</span>
        <span className="font-medium">Rp {cost.toLocaleString('id-ID')}</span>
      </div>
      <Separator />
      <div className="flex justify-between items-center">
        <span className="text-sm">Keuntungan:</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">Rp {profit.amount.toLocaleString('id-ID')}</span>
          {profit.amount > 0 && (
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              +{profit.percentage.toFixed(1)}%
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPricingInventory;
