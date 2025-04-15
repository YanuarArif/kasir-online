"use client";

import React from "react";
import { PurchaseFormValues, Supplier } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  FileText,
  Printer,
  RotateCcw,
  HelpCircle,
} from "lucide-react";

interface PurchaseTransactionSummaryProps {
  formValues: PurchaseFormValues;
  totalAmount: number;
  isPending: boolean;
  itemCount: number;
  suppliers: Supplier[];
}

const PurchaseTransactionSummary: React.FC<PurchaseTransactionSummaryProps> = ({
  formValues,
  totalAmount,
  isPending,
  itemCount,
  suppliers,
}) => {
  const { supplierId, invoiceRef, paymentStatus } = formValues;

  // Get supplier name
  const supplierName =
    suppliers.find((s) => s.id === supplierId)?.name || "Belum dipilih";

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500">
            <Check className="h-3 w-3 mr-1" />
            Lunas
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Belum Dibayar
          </Badge>
        );
      case "partial":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Sebagian
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="sticky top-4 bg-card">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2">Ringkasan Pembelian</h3>

        <div className="space-y-4">
          {/* Transaction Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Informasi Transaksi
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Tanggal:</span>
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Supplier:</span>
                <span className="text-sm font-medium">{supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">No. Faktur:</span>
                <span className="text-sm font-medium">{invoiceRef || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Jumlah Item:</span>
                <span className="text-sm font-medium">{itemCount} item</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Informasi Pembayaran
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status:</span>
                <div>{getPaymentStatusBadge(paymentStatus)}</div>
              </div>
              {formValues.paymentDueDate && (
                <div className="flex justify-between">
                  <span className="text-sm">Jatuh Tempo:</span>
                  <span className="text-sm font-medium">
                    {new Date(formValues.paymentDueDate).toLocaleDateString(
                      "id-ID"
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm">Subtotal:</span>
                <span className="text-sm font-medium">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Info */}
          {formValues.deliveryDate && (
            <>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Informasi Pengiriman
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Tanggal Pengiriman:</span>
                    <span className="text-sm font-medium">
                      {new Date(formValues.deliveryDate).toLocaleDateString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Lacak Pengiriman:</span>
                    <span className="text-sm font-medium">
                      {formValues.trackDelivery ? "Ya" : "Tidak"}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Total */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold">
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled={isPending}
            >
              <Printer className="h-4 w-4 mr-2" />
              Cetak Faktur
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled={isPending}
            >
              <FileText className="h-4 w-4 mr-2" />
              Pratinjau Dokumen
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled={isPending}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Form
            </Button>
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

export default PurchaseTransactionSummary;
