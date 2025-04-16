import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/dashboardlayout";

export default function PurchaseNotFound() {
  return (
    <DashboardLayout pageTitle="Pembelian Tidak Ditemukan">
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Pembelian Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-8">
          Pembelian yang Anda cari tidak ditemukan atau Anda tidak memiliki akses ke pembelian ini.
        </p>
        <Button asChild>
          <Link href="/dashboard/purchases">Kembali ke Daftar Pembelian</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}
