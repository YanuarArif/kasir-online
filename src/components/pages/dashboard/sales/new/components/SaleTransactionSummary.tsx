"use client";

import React from "react";
import { SaleFormValues } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, Printer, RotateCcw } from "lucide-react";

interface SaleTransactionSummaryProps {
  formValues: SaleFormValues;
  totalAmount: number;
  isPending: boolean;
  itemCount: number;
}

const SaleTransactionSummary: React.FC<SaleTransactionSummaryProps> = ({
  formValues,
  totalAmount,
  isPending,
  itemCount,
}) => {
  const { customerId, paymentMethod, amountPaid } = formValues;

  // Mock customer data
  const mockCustomers = [
    { id: "cust1", name: "Pelanggan Umum" },
    { id: "cust2", name: "PT Maju Jaya" },
    { id: "cust3", name: "Toko Sejahtera" },
  ];

  // Get customer name
  const customerName =
    mockCustomers.find((c) => c.id === customerId)?.name || "Pelanggan Umum";

  // Payment methods
  const paymentMethods: Record<string, string> = {
    cash: "Tunai",
    transfer: "Transfer Bank",
    qris: "QRIS",
    credit_card: "Kartu Kredit",
    debit_card: "Kartu Debit",
  };

  // Get payment method name
  const paymentMethodName =
    paymentMethod && paymentMethod in paymentMethods
      ? paymentMethods[paymentMethod]
      : "Tunai";

  // Calculate change
  const amountPaidValue = amountPaid || 0;
  const change = Math.max(0, amountPaidValue - totalAmount);

  // Check if payment is complete
  const isPaymentComplete = amountPaidValue >= totalAmount;

  return (
    <Card className="sticky top-4 bg-card">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2">Ringkasan Penjualan</h3>

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
                <span className="text-sm">Pelanggan:</span>
                <span className="text-sm font-medium">{customerName}</span>
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
              <div className="flex justify-between">
                <span className="text-sm">Metode:</span>
                <span className="text-sm font-medium">{paymentMethodName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Subtotal:</span>
                <span className="text-sm font-medium">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
              {amountPaidValue > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Dibayar:</span>
                    <span className="text-sm font-medium">
                      Rp {amountPaidValue.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Kembalian:</span>
                    <span className="text-sm font-medium">
                      Rp {change.toLocaleString("id-ID")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold">
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>

            {amountPaidValue > 0 && (
              <div className="mt-2 flex justify-end">
                {isPaymentComplete ? (
                  <Badge className="bg-green-500">
                    <Check className="h-3 w-3 mr-1" />
                    Lunas
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="h-3 w-3 mr-1" />
                    Belum Lunas
                  </Badge>
                )}
              </div>
            )}
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
              Cetak Struk
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled={isPending}
            >
              <FileText className="h-4 w-4 mr-2" />
              Pratinjau Faktur
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

export default SaleTransactionSummary;
