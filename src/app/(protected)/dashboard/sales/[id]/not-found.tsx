import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/dashboardlayout";

export default function SaleNotFound() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Penjualan Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-8">
          Penjualan yang Anda cari tidak ditemukan atau Anda tidak memiliki
          akses ke penjualan ini.
        </p>
        <Button asChild>
          <Link href="/dashboard/sales">Kembali ke Daftar Penjualan</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}
