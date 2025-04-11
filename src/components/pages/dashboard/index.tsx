"use client";

import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
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
  CHART_COLORS,
} from "@/components/dashboard/dashboard-charts";

// Sample data for charts
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
  const [mounted, setMounted] = useState(false);

  // Ensure components render properly with SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
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
          value="Rp 1.250.000"
          icon={<CurrencyDollarIcon className="h-5 w-5" />}
          change={{ value: "+12% dari kemarin", type: "increase" }}
          linkText="Lihat semua penjualan"
          linkHref="/dashboard/sales"
          colorScheme="indigo"
        />

        <SummaryCard
          title="Produk Aktif"
          value="152"
          icon={<CubeIcon className="h-5 w-5" />}
          change={{ value: "+5 produk baru", type: "increase" }}
          linkText="Kelola produk"
          linkHref="/dashboard/products"
          colorScheme="emerald"
        />

        <SummaryCard
          title="Pelanggan"
          value="45"
          icon={<UsersIcon className="h-5 w-5" />}
          change={{ value: "+3 minggu ini", type: "increase" }}
          linkText="Lihat pelanggan"
          linkHref="/dashboard/customers"
          colorScheme="blue"
        />

        <SummaryCard
          title="Pembelian Bulan Ini"
          value="Rp 8.500.000"
          icon={<ShoppingBagIcon className="h-5 w-5" />}
          change={{ value: "-5% dari bulan lalu", type: "decrease" }}
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
