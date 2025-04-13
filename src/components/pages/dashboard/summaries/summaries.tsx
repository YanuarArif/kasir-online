"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "lucide-react";
import {
  CubeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { 
  getDashboardSummary, 
  getSalesChartData, 
  getProductDistributionData, 
  getRecentTransactions 
} from "@/actions/dashboard";
import { 
  SalesChart, 
  ProductDistributionChart 
} from "@/components/dashboard/dashboard-charts";

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

// Define types for chart data
type SalesChartDataPoint = {
  name: string;
  total: number;
};

type ProductDistributionDataPoint = {
  name: string;
  value: number;
};

type RecentTransactionItem = {
  id: string;
  time: string;
  amount: string;
  status?: string;
};

const SummaryCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  linkText, 
  linkHref, 
  colorScheme = "indigo" 
}: { 
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    type: "increase" | "decrease";
  };
  linkText?: string;
  linkHref?: string;
  colorScheme?: "indigo" | "emerald" | "blue" | "amber" | "rose";
}) => {
  // Color schemes for different card types
  const colorSchemes = {
    indigo: {
      iconBg: "bg-indigo-100 dark:bg-indigo-900",
      iconText: "text-indigo-600 dark:text-indigo-300",
      linkText: "text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300",
    },
    emerald: {
      iconBg: "bg-emerald-100 dark:bg-emerald-900",
      iconText: "text-emerald-600 dark:text-emerald-300",
      linkText: "text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300",
    },
    blue: {
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconText: "text-blue-600 dark:text-blue-300",
      linkText: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
    },
    amber: {
      iconBg: "bg-amber-100 dark:bg-amber-900",
      iconText: "text-amber-600 dark:text-amber-300",
      linkText: "text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300",
    },
    rose: {
      iconBg: "bg-rose-100 dark:bg-rose-900",
      iconText: "text-rose-600 dark:text-rose-300",
      linkText: "text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300",
    },
  };

  const colors = colorSchemes[colorScheme];

  return (
    <Card className="border-none shadow-md dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`rounded-full ${colors.iconBg} p-2 ${colors.iconText}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={`text-xs ${
              change.type === "increase"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            } flex items-center mt-1`}
          >
            {change.type === "increase" ? (
              <ArrowUpIcon className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 mr-1" />
            )}
            {change.value}
          </p>
        )}
      </CardContent>
      {linkText && linkHref && (
        <CardFooter className="pt-0">
          <Link
            href={linkHref}
            className={`text-xs ${colors.linkText} flex items-center`}
          >
            {linkText}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

const RecentActivity = ({ transactions }: { transactions: RecentTransactionItem[] }) => {
  return (
    <Card className="border-none shadow-md dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Transaksi terbaru di sistem</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border dark:border-gray-700">
          <div className="grid grid-cols-3 bg-muted/50 p-3 text-xs font-medium">
            <div>Transaksi ID</div>
            <div>Waktu</div>
            <div className="text-right">Total</div>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-3 p-3 text-sm"
                >
                  <div className="truncate font-medium">{transaction.id}</div>
                  <div className="flex items-center text-gray-500">
                    <ClockIcon className="mr-1 h-3 w-3" />
                    {transaction.time}
                  </div>
                  <div className="text-right font-medium">{transaction.amount}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">
                Tidak ada transaksi terbaru
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/dashboard/sales">Lihat Semua Transaksi</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function SummariesPage() {
  // State for all dashboard data
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [salesChartData, setSalesChartData] = useState<SalesChartDataPoint[] | null>(null);
  const [productDistData, setProductDistData] = useState<ProductDistributionDataPoint[] | null>(null);
  const [recentTransData, setRecentTransData] = useState<RecentTransactionItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

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
            recentTransResult.error || "Gagal mengambil data transaksi terbaru."
          );
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data dashboard."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-md dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-28 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
              <CardFooter className="pt-0">
                <Skeleton className="h-3 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-4 border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-3 border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Check if all required data is loaded
  if (!summaryData || !salesChartData || !productDistData || !recentTransData) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Perhatian</AlertTitle>
        <AlertDescription>
          Data ringkasan tidak lengkap atau tidak tersedia.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="sales">Penjualan</TabsTrigger>
          <TabsTrigger value="inventory">Inventaris</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
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
                type: "increase",
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
                type: "increase",
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
            {/* Sales Chart */}
            <SalesChart data={salesChartData} />

            {/* Product Distribution Chart */}
            <ProductDistributionChart data={productDistData} />
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <RecentActivity transactions={recentTransData} />
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <Card className="border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Analisis Penjualan</CardTitle>
              <CardDescription>Performa penjualan berdasarkan periode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <SalesChart 
                  data={salesChartData} 
                  title="Tren Penjualan Detail" 
                  description="Analisis penjualan 7 bulan terakhir"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/sales">Lihat Laporan Lengkap</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-6">
          <Card className="border-none shadow-md dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Analisis Inventaris</CardTitle>
              <CardDescription>Distribusi produk berdasarkan kategori</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ProductDistributionChart 
                  data={productDistData} 
                  title="Distribusi Produk Detail" 
                  description="Analisis inventaris berdasarkan kategori"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/products">Kelola Inventaris</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
