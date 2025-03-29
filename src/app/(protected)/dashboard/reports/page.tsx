// pages/dashboard/reports.tsx
import type { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout"; // Adjust path if needed
import {
  ArrowTrendingUpIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const ReportsPage: NextPage = () => {
  return (
    <DashboardLayout pageTitle="Laporan">
      <Head>
        <title>Laporan - Kasir Online</title>
      </Head>

      {/* Page Content */}
      <div className="space-y-8">
        {/* Date Range Selector (Placeholder) */}
        <div className="flex justify-end">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option>Hari Ini</option>
            <option>7 Hari Terakhir</option>
            <option selected>30 Hari Terakhir</option>
            <option>Bulan Ini</option>
            <option>Tahun Ini</option>
            <option>Custom</option>
          </select>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sales Summary Card */}
          <div className="overflow-hidden rounded-lg bg-white p-6 shadow transition hover:shadow-md">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <ArrowTrendingUpIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Ringkasan Penjualan
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                Rp 15.750.000
              </p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                {/* Example trend */}
                +12%
              </p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Lihat Detail Laporan
                    <span className="sr-only"> Ringkasan Penjualan</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>

          {/* Top Products Card */}
          <div className="overflow-hidden rounded-lg bg-white p-6 shadow transition hover:shadow-md">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <ShoppingBagIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Produk Terlaris
              </p>
            </dt>
            <dd className="ml-16 block">
              <ul className="space-y-1 text-sm text-gray-900 mb-4">
                <li>1. Kopi Susu Gula Aren (150)</li>
                <li>2. Croissant Coklat (95)</li>
                <li>3. Nasi Goreng Spesial (70)</li>
              </ul>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Lihat Laporan Produk
                    <span className="sr-only"> Produk Terlaris</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>

          {/* Customer Insights Card (Placeholder) */}
          <div className="overflow-hidden rounded-lg bg-white p-6 shadow transition hover:shadow-md">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Wawasan Pelanggan
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">50</p>
              <p className="ml-2 text-sm text-gray-500">Pelanggan Baru</p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Lihat Laporan Pelanggan
                    <span className="sr-only"> Wawasan Pelanggan</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Grafik Penjualan Bulanan
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            (Placeholder untuk Grafik)
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
