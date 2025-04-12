import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { Role } from "@prisma/client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CurrencyDollarIcon, ReceiptRefundIcon, UserIcon } from "@heroicons/react/24/outline";

const CashierPage = async () => {
  return (
    <ProtectedRoute allowedRoles={[Role.OWNER, Role.ADMIN, Role.CASHIER]}>
      <DashboardLayout pageTitle="Kasir">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Halaman Kasir</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Halaman ini dapat diakses oleh semua peran (Pemilik, Admin, dan Kasir).
              Gunakan halaman ini untuk mengelola transaksi penjualan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <CurrencyDollarIcon className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="text-lg font-medium">Transaksi Baru</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Buat transaksi penjualan baru dengan cepat dan mudah.
              </p>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors">
                Mulai Transaksi
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <ReceiptRefundIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium">Riwayat Transaksi</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Lihat dan kelola riwayat transaksi penjualan.
              </p>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors">
                Lihat Riwayat
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <UserIcon className="h-6 w-6 text-purple-500 mr-2" />
                <h3 className="text-lg font-medium">Pelanggan</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Kelola data pelanggan dan riwayat pembelian.
              </p>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-colors">
                Kelola Pelanggan
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-3">Panduan Kasir</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Membuat Transaksi Baru</h4>
                <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Klik tombol "Mulai Transaksi"</li>
                  <li>Pilih produk dari daftar atau scan barcode</li>
                  <li>Masukkan jumlah produk</li>
                  <li>Tambahkan ke keranjang</li>
                  <li>Selesaikan pembayaran</li>
                </ol>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Tips Penggunaan</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Gunakan shortcut keyboard untuk mempercepat proses</li>
                  <li>Selalu verifikasi jumlah produk sebelum checkout</li>
                  <li>Pastikan printer struk dalam kondisi baik</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default CashierPage;
