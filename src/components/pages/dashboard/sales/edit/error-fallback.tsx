"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorFallbackProps {
  saleId: string;
  errorMessage: string;
}

const SaleEditErrorFallback: React.FC<ErrorFallbackProps> = ({
  saleId,
  errorMessage,
}) => {
  const router = useRouter();

  // Show error toast when component mounts
  useEffect(() => {
    toast.error(errorMessage);
  }, [errorMessage]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Penjualan</h1>
          <p className="text-muted-foreground">
            Perbarui transaksi penjualan dengan mengisi detail di bawah ini
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href={`/dashboard/sales/${saleId}`}>
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Gagal memuat data yang diperlukan untuk mengedit penjualan.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.refresh()}>
                Coba Lagi
              </Button>
              <Button asChild>
                <Link href="/dashboard/sales">Kembali ke Daftar Penjualan</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Ringkasan Penjualan</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Informasi penjualan tidak tersedia saat ini.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaleEditErrorFallback;
