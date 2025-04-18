"use client";

import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/dashboardlayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePurchase } from "@/actions/purchases";

interface Product {
  id: string;
  name: string;
  price: number;
  cost: number | null;
}

interface PurchaseItem {
  id: string;
  quantity: number;
  costAtPurchase: number;
  productId: string;
  product: Product;
}

interface Supplier {
  id: string;
  name: string;
}

interface Purchase {
  id: string;
  totalAmount: number;
  invoiceRef: string | null;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  supplierId: string | null;
  supplier: Supplier | null;
  items: PurchaseItem[];
}

interface PurchaseDetailPageProps {
  purchase: Purchase;
}

const PurchaseDetailPage: NextPage<PurchaseDetailPageProps> = ({
  purchase,
}) => {
  const router = useRouter();
  const purchaseDate = new Date(purchase.purchaseDate);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Handle delete purchase
  const handleDeletePurchase = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePurchase(purchase.id);
      if (result.success) {
        toast.success(result.success);
        router.push("/dashboard/purchases");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
      toast.error("Terjadi kesalahan saat menghapus pembelian.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Detail Pembelian - Kasir Online</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button and Edit button */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali
          </Button>

          <Button
            asChild
            variant="default"
            size="sm"
            className="flex items-center gap-2"
          >
            <Link href={`/dashboard/purchases/${purchase.id}/edit`}>
              <PencilIcon className="h-4 w-4" />
              Edit Pembelian
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Pembelian #{purchase.id.substring(0, 8)}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {purchaseDate.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {purchase.invoiceRef && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    No. Invoice: {purchase.invoiceRef}
                  </p>
                )}
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                Selesai
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Purchase Items */}
              <div>
                <h3 className="text-lg font-medium mb-3">Item Pembelian</h3>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Produk
                        </th>
                        <th scope="col" className="px-6 py-3 text-right">
                          Harga Beli
                        </th>
                        <th scope="col" className="px-6 py-3 text-right">
                          Jumlah
                        </th>
                        <th scope="col" className="px-6 py-3 text-right">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchase.items.map((item) => (
                        <tr
                          key={item.id}
                          className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                            {item.product.name}
                          </td>
                          <td className="px-6 py-4 text-right">
                            Rp {item.costAtPurchase.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            Rp{" "}
                            {(
                              item.quantity * item.costAtPurchase
                            ).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td
                          colSpan={3}
                          className="px-6 py-4 text-right font-medium text-gray-700 dark:text-gray-300"
                        >
                          Total
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-gray-100">
                          Rp {purchase.totalAmount.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <Separator />

              {/* Purchase Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Informasi Pembelian
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">ID Pembelian</div>
                      <div>{purchase.id}</div>

                      <div className="font-medium">Tanggal Pembelian</div>
                      <div>
                        {purchaseDate.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>

                      <div className="font-medium">Waktu</div>
                      <div>
                        {purchaseDate.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <div className="font-medium">Supplier</div>
                      <div>
                        {purchase.supplier ? purchase.supplier.name : "-"}
                      </div>

                      <div className="font-medium">No. Invoice</div>
                      <div>{purchase.invoiceRef || "-"}</div>

                      <div className="font-medium">Jumlah Item</div>
                      <div>{purchase.items.length} item</div>

                      <div className="font-medium">Total</div>
                      <div className="font-bold">
                        Rp {purchase.totalAmount.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Informasi Tambahan
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Dibuat pada</div>
                      <div>
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>

                      <div className="font-medium">Terakhir diperbarui</div>
                      <div>
                        {new Date(purchase.updatedAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-4 justify-end">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/purchases/${purchase.id}/edit`}>
                    Edit Pembelian
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash className="h-4 w-4" />
                      Hapus Pembelian
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus pembelian ini?
                        Tindakan ini tidak dapat dibatalkan dan akan mengurangi
                        stok produk.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeletePurchase}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {isDeleting ? "Menghapus..." : "Hapus"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PurchaseDetailPage;
