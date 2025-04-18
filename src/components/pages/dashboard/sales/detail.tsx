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
import { deleteSale } from "@/actions/sales";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface SaleItem {
  id: string;
  quantity: number;
  priceAtSale: number;
  productId: string;
  product: Product;
}

interface Sale {
  id: string;
  totalAmount: number;
  saleDate: string;
  createdAt: string;
  updatedAt: string;
  items: SaleItem[];
}

interface SaleDetailPageProps {
  sale: Sale;
}

const SaleDetailPage: NextPage<SaleDetailPageProps> = ({ sale }) => {
  const router = useRouter();
  const saleDate = new Date(sale.saleDate);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Handle delete sale
  const handleDeleteSale = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSale(sale.id);
      if (result.success) {
        toast.success(result.success);
        router.push("/dashboard/sales");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("Terjadi kesalahan saat menghapus penjualan.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Detail Penjualan - Kasir Online</title>
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
            <Link href={`/dashboard/sales/${sale.id}/edit`}>
              <PencilIcon className="h-4 w-4" />
              Edit Penjualan
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Penjualan #{sale.id.substring(0, 8)}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {saleDate.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
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
              {/* Sale Items */}
              <div>
                <h3 className="text-lg font-medium mb-3">Item Penjualan</h3>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Produk
                        </th>
                        <th scope="col" className="px-6 py-3 text-right">
                          Harga
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
                      {sale.items.map((item) => (
                        <tr
                          key={item.id}
                          className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                            {item.product.name}
                          </td>
                          <td className="px-6 py-4 text-right">
                            Rp {item.priceAtSale.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            Rp{" "}
                            {(item.quantity * item.priceAtSale).toLocaleString(
                              "id-ID"
                            )}
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
                          Rp {sale.totalAmount.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <Separator />

              {/* Sale Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Informasi Penjualan
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">ID Penjualan</div>
                      <div>{sale.id}</div>

                      <div className="font-medium">Tanggal Penjualan</div>
                      <div>
                        {saleDate.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>

                      <div className="font-medium">Waktu</div>
                      <div>
                        {saleDate.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <div className="font-medium">Jumlah Item</div>
                      <div>{sale.items.length} item</div>

                      <div className="font-medium">Total</div>
                      <div className="font-bold">
                        Rp {sale.totalAmount.toLocaleString("id-ID")}
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
                        {new Date(sale.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>

                      <div className="font-medium">Terakhir diperbarui</div>
                      <div>
                        {new Date(sale.updatedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-4 justify-end">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/sales/${sale.id}/edit`}>
                    Edit Penjualan
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash className="h-4 w-4" />
                      Hapus Penjualan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus penjualan ini?
                        Tindakan ini tidak dapat dibatalkan dan akan
                        mengembalikan stok produk.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSale}
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

export default SaleDetailPage;
