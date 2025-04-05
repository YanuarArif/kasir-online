// pages/dashboard/index.tsx
import type { NextPage } from "next";
import Head from "next/head";
import { CubeIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import DashboardLayout from "@/components/layout/dashboardlayout";

const DashboardHomePage: NextPage = () => {
  return (
    <DashboardLayout pageTitle="Dashboard Utama">
      <Head>
        <title>Dashboard - Kasir Online</title>
      </Head>

      {/* Page header (optional, already have one in layout) */}
      {/* <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Utama</h1>
      </div> */}

      {/* Start Content Area */}
      <div className="py-4">
        <div className="space-y-4">
          {/* Example Content: Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Example Card 1 */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Penjualan Hari Ini
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          Rp 1.250.000
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-700 hover:text-indigo-900"
                  >
                    Lihat Semua
                  </a>
                </div>
              </div>
            </div>

            {/* Add more cards like the one above */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              {" "}
              {/* Card 2 */}
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CubeIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Produk Aktif
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          152
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              {" "}
              {/* Card 3 */}
              {/* ... content ... */}
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              {" "}
              {/* Card 4 */}
              {/* ... content ... */}
            </div>
          </div>

          {/* Example Content: Recent Activity Table */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Aktivitas Terbaru
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {/* Replace with actual table data */}
              <div className="min-w-full divide-y divide-gray-200">
                <div className="bg-gray-50">
                  {/* Table Header (Example) */}
                  <div className="grid grid-cols-3 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <span>Transaksi ID</span>
                    <span>Waktu</span>
                    <span className="text-right">Total</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 bg-white">
                  {/* Table Row (Example) */}
                  <div className="grid grid-cols-3 px-6 py-4 text-sm text-gray-900">
                    <span className="text-indigo-600 hover:text-indigo-900">
                      #INV12345
                    </span>
                    <span>10 menit lalu</span>
                    <span className="text-right font-medium">Rp 75.000</span>
                  </div>
                  <div className="grid grid-cols-3 px-6 py-4 text-sm text-gray-900">
                    <span className="text-indigo-600 hover:text-indigo-900">
                      #INV12344
                    </span>
                    <span>1 jam lalu</span>
                    <span className="text-right font-medium">Rp 120.000</span>
                  </div>
                  {/* Add more rows */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Content Area */}
    </DashboardLayout>
  );
};

export default DashboardHomePage;
