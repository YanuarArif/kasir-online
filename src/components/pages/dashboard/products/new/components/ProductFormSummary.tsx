"use client";

import React from "react";
import { ProductFormValues } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CircleCheck, X } from "lucide-react";

interface ProductFormSummaryProps {
  formValues: ProductFormValues;
  isPending: boolean;
}

const ProductFormSummary: React.FC<ProductFormSummaryProps> = ({
  formValues,
  isPending,
}) => {
  const { name, price, cost, stock, trackInventory } = formValues;

  // Calculate profit if both price and cost are available
  const profit = price && cost ? price - cost : null;
  const profitPercentage = profit && cost ? (profit / cost) * 100 : null;

  return (
    <Card className="sticky top-4 bg-card">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2">Ringkasan Produk</h3>

        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Informasi Dasar
            </h4>
            <p className="font-medium truncate">{name || "Belum ada nama"}</p>
          </div>

          <Separator />

          {/* Pricing */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Harga
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Harga Jual</p>
                <p className="font-medium">
                  {price ? `Rp ${price.toLocaleString("id-ID")}` : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Harga Beli</p>
                <p className="font-medium">
                  {cost ? `Rp ${cost.toLocaleString("id-ID")}` : "-"}
                </p>
              </div>
              {profit !== null && (
                <div className="col-span-2 mt-1">
                  <p className="text-xs text-muted-foreground">Keuntungan</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      Rp {profit.toLocaleString("id-ID")}
                    </p>
                    {profitPercentage !== null && (
                      <Badge
                        variant="outline"
                        className={
                          profit > 0
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }
                      >
                        {profit > 0 ? "+" : ""}
                        {profitPercentage.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Inventory */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Inventaris
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Lacak Stok</p>
                <div>
                  {trackInventory ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1"
                    >
                      <CircleCheck className="h-3 w-3" />
                      Aktif
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Nonaktif
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Stok Awal</p>
                <p className="font-medium">{stock || 0} unit</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="pt-2">
            <Badge
              variant={isPending ? "secondary" : "default"}
              className="w-full justify-center py-1"
            >
              {isPending ? "Menyimpan..." : "Siap Disimpan"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFormSummary;
