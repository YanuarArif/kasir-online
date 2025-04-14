// pages/dashboard/reports.tsx
"use client";

import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowTrendingUpIcon,
  ShoppingBagIcon,
  CubeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { getPurchaseReportData } from "@/actions/reports";
import { format, parseISO } from "date-fns";

// Temporary placeholder components until we fix the TypeScript errors
// These will be replaced with the actual components once the build issues are resolved

// Placeholder for SalesReportTable
const SalesReportTable = ({ dateRange }: { dateRange: string }) => (
  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-md">
    Sales Report Table (Date Range: {dateRange})
  </div>
);

// Placeholder for SalesReportChart
const SalesReportChart = ({ dateRange }: { dateRange: string }) => (
  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-md">
    Sales Report Chart (Date Range: {dateRange})
  </div>
);

// Placeholder for PurchasesReportTable
const PurchasesReportTable = ({ dateRange }: { dateRange: string }) => (
  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-md">
    Purchases Report Table (Date Range: {dateRange})
  </div>
);

// Placeholder for PurchasesReportChart
const PurchasesReportChart = ({ dateRange }: { dateRange: string }) => (
  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-md">
    Purchases Report Chart (Date Range: {dateRange})
  </div>
);

// Placeholder for ProductsReportTable
const ProductsReportTable = ({ dateRange }: { dateRange: string }) => (
  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-md">
    Products Report Table (Date Range: {dateRange})
  </div>
);

// Placeholder for ProductsReportChart
const ProductsReportChart = ({ dateRange }: { dateRange: string }) => (
  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-md">
    Products Report Chart (Date Range: {dateRange})
  </div>
);

const ReportsPage: NextPage = () => {
  // State for main tabs and sub tabs
  const [mainTab, setMainTab] = useState<string>("sales");
  const [salesSubTab, setSalesSubTab] = useState<string>("table");
  const [purchasesSubTab, setPurchasesSubTab] = useState<string>("table");
  const [productsSubTab, setProductsSubTab] = useState<string>("table");
  const [dateRange, setDateRange] = useState<string>("30d");

  // Function to handle Excel export
  const handleExportToExcel = (data: any[], fileName: string) => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <DashboardLayout pageTitle="Laporan">
      <Head>
        <title>Laporan - Kasir Online</title>
      </Head>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header and Date Range */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Laporan
          </h1>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
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

        {/* Main Tabs */}
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="sales">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
              Penjualan
            </TabsTrigger>
            <TabsTrigger value="purchases">
              <ShoppingBagIcon className="h-4 w-4 mr-2" />
              Pembelian
            </TabsTrigger>
            <TabsTrigger value="products">
              <CubeIcon className="h-4 w-4 mr-2" />
              Produk
            </TabsTrigger>
          </TabsList>

          {/* Sales Tab Content */}
          <TabsContent value="sales" className="space-y-6">
            <Tabs
              value={salesSubTab}
              onValueChange={setSalesSubTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="table">Laporan Tabel</TabsTrigger>
                <TabsTrigger value="chart">Laporan Grafik</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Mock data for export
                      const mockSalesData = [
                        {
                          ID: "INV-001",
                          Tanggal: "14 April 2025",
                          Pelanggan: "John Doe",
                          "Jumlah Item": 5,
                          Total: 250000,
                          "Metode Pembayaran": "Cash",
                        },
                        {
                          ID: "INV-002",
                          Tanggal: "13 April 2025",
                          Pelanggan: "Jane Smith",
                          "Jumlah Item": 3,
                          Total: 175000,
                          "Metode Pembayaran": "Credit Card",
                        },
                        {
                          ID: "INV-003",
                          Tanggal: "12 April 2025",
                          Pelanggan: "Bob Johnson",
                          "Jumlah Item": 7,
                          Total: 350000,
                          "Metode Pembayaran": "Debit Card",
                        },
                      ];
                      handleExportToExcel(mockSalesData, "laporan-penjualan");
                    }}
                    className="flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export Excel
                  </Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Laporan Penjualan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SalesReportTable dateRange={dateRange} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chart" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Grafik Penjualan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SalesReportChart dateRange={dateRange} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Purchases Tab Content */}
          <TabsContent value="purchases" className="space-y-6">
            <Tabs
              value={purchasesSubTab}
              onValueChange={setPurchasesSubTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="table">Laporan Tabel</TabsTrigger>
                <TabsTrigger value="chart">Laporan Grafik</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        // Get actual data from the database
                        const result = await getPurchaseReportData(dateRange);

                        if (result.error) {
                          alert(result.error);
                          return;
                        }

                        if (
                          !result.success ||
                          !result.data ||
                          result.data.length === 0
                        ) {
                          alert("Tidak ada data untuk diekspor");
                          return;
                        }

                        // Format data for Excel export
                        const exportData = result.data.map((purchase) => ({
                          ID: purchase.id,
                          Tanggal: formatDate(purchase.date),
                          Supplier: purchase.supplier,
                          "Jumlah Item": purchase.items,
                          Total: purchase.total,
                          "Referensi Invoice": purchase.invoiceRef,
                        }));

                        handleExportToExcel(exportData, "laporan-pembelian");
                      } catch (error) {
                        console.error("Error exporting purchase data:", error);
                        alert("Gagal mengekspor data pembelian");
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export Excel
                  </Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Laporan Pembelian</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PurchasesReportTable dateRange={dateRange} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chart" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Grafik Pembelian</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PurchasesReportChart dateRange={dateRange} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Products Tab Content */}
          <TabsContent value="products" className="space-y-6">
            <Tabs
              value={productsSubTab}
              onValueChange={setProductsSubTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="table">Laporan Tabel</TabsTrigger>
                <TabsTrigger value="chart">Laporan Grafik</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Mock data for export
                      const mockProductsData = [
                        {
                          ID: "P001",
                          "Nama Produk": "Kopi Susu Gula Aren",
                          Kategori: "Minuman",
                          Stok: 45,
                          Terjual: 150,
                          Pendapatan: 3000000,
                          Keuntungan: 1500000,
                        },
                        {
                          ID: "P002",
                          "Nama Produk": "Croissant Coklat",
                          Kategori: "Makanan",
                          Stok: 30,
                          Terjual: 95,
                          Pendapatan: 1900000,
                          Keuntungan: 950000,
                        },
                        {
                          ID: "P003",
                          "Nama Produk": "Nasi Goreng Spesial",
                          Kategori: "Makanan",
                          Stok: 25,
                          Terjual: 70,
                          Pendapatan: 1750000,
                          Keuntungan: 875000,
                        },
                      ];
                      handleExportToExcel(mockProductsData, "laporan-produk");
                    }}
                    className="flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export Excel
                  </Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Laporan Produk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductsReportTable dateRange={dateRange} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chart" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Grafik Produk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductsReportChart dateRange={dateRange} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
