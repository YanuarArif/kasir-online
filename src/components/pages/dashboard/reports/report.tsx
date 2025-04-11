// pages/dashboard/reports.tsx
import type { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout"; // Adjust path if needed
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming Card component exists
// Removed import for Select as it's not found
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
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header and Date Range */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Add dark mode text color */}
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Laporan
          </h1>
          {/* Date Range Selector - Add dark mode styles */}
          <select
            defaultValue="30d"
            className="w-full sm:w-auto rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
          >
            <option value="today">Hari Ini</option>
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sales Summary Card - Using ShadCN Card (Should handle dark mode) */}
          {/* Check specific text colors inside */}
          <Card className="flex flex-col transition hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {/* CardTitle likely handles dark mode, but check text-gray-500 */}
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ringkasan Penjualan
              </CardTitle>
              {/* Adjust icon background/color for dark mode */}
              <div className="flex-shrink-0 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2">
                <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Add dark mode text color */}
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Rp 15.750.000
              </div>
              {/* Adjust green color for dark mode if needed */}
              <p className="text-xs text-green-600 dark:text-green-400 flex items-baseline mt-1">
                +12% dari bulan lalu
              </p>
            </CardContent>
            <CardFooter className="text-sm">
              {/* Add dark mode link color */}
              <a
                href="#"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Lihat Detail
              </a>
            </CardFooter>
          </Card>

          {/* Top Products Card - Using ShadCN Card (Should handle dark mode) */}
          {/* Check specific text colors inside */}
          <Card className="flex flex-col transition hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {/* CardTitle likely handles dark mode, but check text-gray-500 */}
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Produk Terlaris
              </CardTitle>
              {/* Adjust icon background/color for dark mode */}
              <div className="flex-shrink-0 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2">
                <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Add dark mode text color */}
              <ul className="mt-1 space-y-1 text-sm text-gray-900 dark:text-gray-100">
                <li>1. Kopi Susu Gula Aren (150)</li>
                <li>2. Croissant Coklat (95)</li>
                <li>3. Nasi Goreng Spesial (70)</li>
                {/* Add more or fetch dynamically */}
              </ul>
            </CardContent>
            <CardFooter className="text-sm">
              {/* Add dark mode link color */}
              <a
                href="#"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Lihat Laporan Produk
              </a>
            </CardFooter>
          </Card>

          {/* Customer Insights Card - Using ShadCN Card (Should handle dark mode) */}
          {/* Check specific text colors inside */}
          <Card className="flex flex-col transition hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {/* CardTitle likely handles dark mode, but check text-gray-500 */}
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Wawasan Pelanggan
              </CardTitle>
              {/* Adjust icon background/color for dark mode */}
              <div className="flex-shrink-0 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2">
                <UsersIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Add dark mode text color */}
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                50
              </div>
              {/* Add dark mode text color */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Pelanggan Baru bulan ini
              </p>
            </CardContent>
            <CardFooter className="text-sm">
              {/* Add dark mode link color */}
              <a
                href="#"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Lihat Laporan Pelanggan
              </a>
            </CardFooter>
          </Card>
        </div>

        {/* Chart Placeholder - Improved Styling */}
        {/* Card should handle dark mode */}
        <Card className="transition hover:shadow-lg">
          <CardHeader>
            {/* CardTitle likely handles dark mode */}
            <CardTitle className="text-lg font-medium">
              Grafik Penjualan Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add dark mode styles to placeholder */}
            <div className="h-64 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-center p-4">
              (Placeholder: Grafik Penjualan akan ditampilkan di sini)
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
