import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/dashboardlayout";

export default function ProductNotFound() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-8">
          Produk yang Anda cari tidak ditemukan atau Anda tidak memiliki akses
          ke produk ini.
        </p>
        <Button asChild>
          <Link href="/dashboard/products">Kembali ke Daftar Produk</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}
