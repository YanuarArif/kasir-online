"use client";

import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  getDashboardSummary,
  getSalesChartData,
  getProductDistributionData,
  getRecentTransactions,
} from "@/actions/dashboard"; // Import all server actions
import type {
  SalesChartDataPoint,
  ProductDistributionDataPoint,
  RecentTransactionItem,
} from "@/actions/dashboard"; // Import types
import {
  CubeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingBagIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "@/components/layout/dashboardlayout";

// Import our reusable components
import { SummaryCard } from "@/components/dashboard/summary-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  SalesChart,
  ProductDistributionChart,
} from "@/components/dashboard/dashboard-charts";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert for error state
import { Terminal } from "lucide-react"; // Icon for error alert

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper to format percentage change for display
const formatChange = (change: number) => {
  const sign = change > 0 ? "+" : "";
  return `${sign}${change}%`;
};

// Define type for summary data
type SummaryData = {
  salesToday: number;
  salesChange: number;
  totalProducts: number;
  newProductsCount: number;
  totalCustomers: number;
  newCustomersCount: number;
  purchasesThisMonth: number;
  purchasesChange: number;
};

// No longer need sample data here
// const salesData = [...];
// const productData = [...];
// const recentTransactions = [...];

const quickActions = [
  {
    label: "Tambah Penjualan",
    href: "/dashboard/sales/new",
    icon: <PlusIcon className="mr-2 h-4 w-4" />,
    colorClass: "bg-indigo-600 hover:bg-indigo-700",
  },
  {
    label: "Tambah Pembelian",
    href: "/dashboard/purchases/new",
    icon: <PlusIcon className="mr-2 h-4 w-4" />,
    colorClass: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    label: "Tambah Produk",
    href: "/dashboard/products/new",
    icon: <PlusIcon className="mr-2 h-4 w-4" />,
    colorClass: "bg-amber-600 hover:bg-amber-700",
  },
];

const DashboardHomePage: NextPage = () => {
  // State for all dashboard data
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [salesChartData, setSalesChartData] = useState<
    SalesChartDataPoint[] | null
  >(null);
  const [productDistData, setProductDistData] = useState<
    ProductDistributionDataPoint[] | null
  >(null);
  const [recentTransData, setRecentTransData] = useState<
    RecentTransactionItem[] | null
  >(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all data concurrently
        const [
          summaryResult,
          salesChartResult,
          productDistResult,
          recentTransResult,
        ] = await Promise.all([
          getDashboardSummary(),
          getSalesChartData(),
          getProductDistributionData(),
          getRecentTransactions(),
        ]);

        // Process results and update state
        if (summaryResult.success && summaryResult.data) {
          // No need to convert here as it's done in the action now
          setSummaryData(summaryResult.data);
        } else {
          throw new Error(
            summaryResult.error || "Gagal mengambil data ringkasan."
          );
        }

        if (salesChartResult.success && salesChartResult.data) {
          setSalesChartData(salesChartResult.data);
        } else {
          throw new Error(
            salesChartResult.error || "Gagal mengambil data grafik penjualan."
          );
        }

        if (productDistResult.success && productDistResult.data) {
          setProductDistData(productDistResult.data);
        } else {
          throw new Error(
            productDistResult.error || "Gagal mengambil data distribusi produk."
          );
        }

        if (recentTransResult.success && recentTransResult.data) {
          setRecentTransData(recentTransResult.data);
        } else {
          throw new Error(
            recentTransResult.error || "Gagal mengambil transaksi terkini."
          );
        }
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          err.message || "Terjadi kesalahan saat memuat data dashboard."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Render loading skeletons
  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Dashboard Utama">
        <Head>
          <title>Memuat Dashboard... - Kasir Online</title>
        </Head>
        <QuickActions actions={quickActions} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[140px] w-full rounded-lg" />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-7">
          <Skeleton className="h-[300px] w-full rounded-lg lg:col-span-4" />
          <Skeleton className="h-[300px] w-full rounded-lg lg:col-span-3" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Render error message
  if (error) {
    return (
      <DashboardLayout pageTitle="Dashboard Utama">
        <Head>
          <title>Error - Kasir Online</title>
        </Head>
        <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  // Render dashboard with data
  // Check if all required data is loaded before rendering the main content
  if (!summaryData || !salesChartData || !productDistData || !recentTransData) {
    // This case should ideally be covered by loading/error states,
    // but acts as a fallback if some data fails partially without throwing a blocking error.
    return (
      <DashboardLayout pageTitle="Dashboard Utama">
        <Head>
          <title>Dashboard - Kasir Online</title>
        </Head>
        <p>Data dashboard tidak lengkap atau tidak tersedia.</p>
        {/* Optionally show partial data if needed */}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Dashboard Utama">
      <Head>
        <title>Dashboard - Kasir Online</title>
      </Head>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Penjualan Hari Ini"
          value={formatCurrency(summaryData.salesToday)}
          icon={<CurrencyDollarIcon className="h-5 w-5" />}
          change={{
            value: `${formatChange(summaryData.salesChange)} dari kemarin`,
            type: summaryData.salesChange >= 0 ? "increase" : "decrease",
          }}
          linkText="Lihat semua penjualan"
          linkHref="/dashboard/sales"
          colorScheme="indigo"
        />

        <SummaryCard
          title="Produk Aktif"
          value={summaryData.totalProducts.toString()}
          icon={<CubeIcon className="h-5 w-5" />}
          change={{
            value: `+${summaryData.newProductsCount} baru (7 hari)`,
            type: "increase", // Assuming new products is always an increase/neutral info
          }}
          linkText="Kelola produk"
          linkHref="/dashboard/products"
          colorScheme="emerald"
        />

        <SummaryCard
          title="Pelanggan"
          value={summaryData.totalCustomers.toString()}
          icon={<UsersIcon className="h-5 w-5" />}
          change={{
            value: `+${summaryData.newCustomersCount} baru (7 hari)`,
            type: "increase", // Assuming new customers is always an increase/neutral info
          }}
          linkText="Lihat pelanggan"
          linkHref="/dashboard/customers"
          colorScheme="blue"
        />

        <SummaryCard
          title="Pembelian Bulan Ini"
          value={formatCurrency(summaryData.purchasesThisMonth)}
          icon={<ShoppingBagIcon className="h-5 w-5" />}
          change={{
            value: `${formatChange(summaryData.purchasesChange)} dari bulan lalu`,
            type: summaryData.purchasesChange >= 0 ? "increase" : "decrease",
          }}
          linkText="Lihat pembelian"
          linkHref="/dashboard/purchases"
          colorScheme="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Sales Chart */}
        <SalesChart data={salesChartData} />

        {/* Product Distribution Chart */}
        <ProductDistributionChart data={productDistData} />
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <RecentActivity transactions={recentTransData} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;
