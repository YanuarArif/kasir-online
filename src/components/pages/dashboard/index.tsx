"use client";

import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { getDashboardSummary } from "@/actions/dashboard"; // Import the server action
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

// Sample data for charts (can be replaced with fetched data later if needed)
const salesData = [
  { name: "Jan", total: 1500000 },
  { name: "Feb", total: 2300000 },
  { name: "Mar", total: 1800000 },
  { name: "Apr", total: 2800000 },
  { name: "May", total: 2100000 },
  { name: "Jun", total: 3200000 },
  { name: "Jul", total: 2900000 },
];

const productData = [
  { name: "Makanan", value: 35 },
  { name: "Minuman", value: 25 },
  { name: "Elektronik", value: 15 },
  { name: "Pakaian", value: 20 },
  { name: "Lainnya", value: 5 },
];

const recentTransactions = [
  {
    id: "INV12345",
    time: "10 menit lalu",
    amount: "Rp 75.000",
    status: "success",
  },
  {
    id: "INV12344",
    time: "1 jam lalu",
    amount: "Rp 120.000",
    status: "success",
  },
  {
    id: "INV12343",
    time: "3 jam lalu",
    amount: "Rp 250.000",
    status: "success",
  },
  {
    id: "INV12342",
    time: "5 jam lalu",
    amount: "Rp 85.000",
    status: "success",
  },
];

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
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getDashboardSummary();
        if (result.success && result.data) {
          // Convert Decimal types to number before setting state
          const formattedData: SummaryData = {
            ...result.data,
            salesToday: Number(result.data.salesToday), // Convert Decimal to number
            purchasesThisMonth: Number(result.data.purchasesThisMonth), // Convert Decimal to number
          };
          setSummaryData(formattedData);
        } else {
          setError(result.error || "Gagal mengambil data ringkasan.");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
        setError("Terjadi kesalahan saat menghubungi server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
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
  if (!summaryData) {
    // Should not happen if loading and error states are handled, but good practice
    return (
      <DashboardLayout pageTitle="Dashboard Utama">
        <Head>
          <title>Dashboard - Kasir Online</title>
        </Head>
        <p>Data tidak tersedia.</p>
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
        <SalesChart data={salesData} />

        {/* Product Distribution Chart */}
        <ProductDistributionChart data={productData} />
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <RecentActivity transactions={recentTransactions} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;
