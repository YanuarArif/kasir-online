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
import {
  getPurchaseReportData,
  getSalesReportData,
  getProductReportData,
} from "@/actions/reports";
import { format, parseISO } from "date-fns";
import { SalesReportTable } from "./components/SalesReportTable";
import { SalesReportChart } from "./components/SalesReportChart";
import { PurchasesReportTable } from "./components/PurchasesReportTable";
import { PurchasesReportChart } from "./components/PurchasesReportChart";
import { ProductsReportTable } from "./components/ProductsReportTable";
import { ProductsReportChart } from "./components/ProductsReportChart";

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
    <DashboardLayout>
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
          {/* Make TabsList a grid to ensure full width distribution */}
          <TabsList className="grid w-full grid-cols-3 mb-4">
            {/* Adjusted styling for TabsTrigger */}
            <TabsTrigger
              value="sales"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground hover:bg-muted"
            >
              <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
              Penjualan
            </TabsTrigger>
            <TabsTrigger
              value="purchases"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground hover:bg-muted"
            >
              <ShoppingBagIcon className="h-4 w-4 mr-2" />
              Pembelian
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground hover:bg-muted"
            >
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
                    onClick={async () => {
                      try {
                        const result = await getSalesReportData(dateRange);
                        if (result.error) {
                          alert(result.error);
                          return;
                        }
                        if (
                          !result.success ||
                          !result.data ||
                          result.data.length === 0
                        ) {
                          alert("Tidak ada data penjualan untuk diekspor");
                          return;
                        }
                        const exportData = result.data.map((sale) => ({
                          ID: sale.id,
                          Tanggal: formatDate(sale.date),
                          Pelanggan: sale.customer,
                          "Jumlah Item": sale.items,
                          Total: sale.total,
                          // 'Metode Pembayaran': sale.paymentMethod, // Not available
                        }));
                        handleExportToExcel(exportData, "laporan-penjualan");
                      } catch (error) {
                        console.error("Error exporting sales data:", error);
                        alert("Gagal mengekspor data penjualan");
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
                    onClick={async () => {
                      try {
                        const result = await getProductReportData(dateRange);
                        if (result.error) {
                          alert(result.error);
                          return;
                        }
                        if (
                          !result.success ||
                          !result.data ||
                          result.data.length === 0
                        ) {
                          alert("Tidak ada data produk untuk diekspor");
                          return;
                        }
                        const exportData = result.data.map((product) => ({
                          ID: product.id,
                          "Nama Produk": product.name,
                          Kategori: product.category,
                          Stok: product.stock,
                          Terjual: product.sold,
                          Pendapatan: product.revenue,
                          Keuntungan: product.profit,
                        }));
                        handleExportToExcel(exportData, "laporan-produk");
                      } catch (error) {
                        console.error("Error exporting product data:", error);
                        alert("Gagal mengekspor data produk");
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
