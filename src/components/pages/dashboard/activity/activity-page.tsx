"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ClockIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  getActivities,
  ActivityItem,
  ActivityType,
  ActivityFilters,
} from "@/actions/activity";

const ITEMS_PER_PAGE = 10;

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<ActivityType | "all">("all");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
  const [employeeOnly, setEmployeeOnly] = useState(false);

  const fetchActivities = async (page: number = 1, filters?: ActivityFilters) => {
    setLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const result = await getActivities({
        limit: ITEMS_PER_PAGE,
        offset,
        filters,
      });

      if (result.success && result.data) {
        setActivities(result.data);
        setTotalCount(result.totalCount || 0);
        setError(null);
      } else {
        setError(result.error || "Gagal mengambil aktivitas");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil aktivitas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters: ActivityFilters = {
      type: activeTab !== "all" ? activeTab : undefined,
      startDate: dateRange.startDate ? new Date(dateRange.startDate) : undefined,
      endDate: dateRange.endDate ? new Date(dateRange.endDate) : undefined,
      employeeOnly: employeeOnly || undefined,
    };
    fetchActivities(currentPage, filters);
  }, [currentPage, activeTab, dateRange, employeeOnly]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as ActivityType | "all");
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleDateRangeChange = (
    field: "startDate" | "endDate",
    value: string
  ) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when changing date range
  };

  const handleEmployeeFilterChange = (value: boolean) => {
    setEmployeeOnly(value);
    setCurrentPage(1); // Reset to first page when changing employee filter
  };

  const handleRefresh = () => {
    const filters: ActivityFilters = {
      type: activeTab !== "all" ? activeTab : undefined,
      startDate: dateRange.startDate ? new Date(dateRange.startDate) : undefined,
      endDate: dateRange.endDate ? new Date(dateRange.endDate) : undefined,
      employeeOnly: employeeOnly || undefined,
    };
    fetchActivities(currentPage, filters);
  };

  const handleClearFilters = () => {
    setActiveTab("all");
    setDateRange({ startDate: "", endDate: "" });
    setEmployeeOnly(false);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Function to get activity icon based on type
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "sale":
        return <CurrencyDollarIcon className="h-5 w-5 text-green-500" />;
      case "purchase":
        return <ShoppingBagIcon className="h-5 w-5 text-blue-500" />;
      case "product":
        return <CubeIcon className="h-5 w-5 text-purple-500" />;
      case "login":
        return <UserIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get activity color based on type
  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case "sale":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "purchase":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "product":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "login":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <ClockIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Aktivitas Sistem
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Pantau semua aktivitas di sistem Anda
          </p>
        </div>
      </div>

      <div className="px-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Riwayat Aktivitas</CardTitle>
                <CardDescription>
                  Semua aktivitas yang terjadi di sistem
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="h-8"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8"
                >
                  <FunnelIcon className="h-4 w-4 mr-1" />
                  Reset Filter
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="sale">Penjualan</TabsTrigger>
                  <TabsTrigger value="purchase">Pembelian</TabsTrigger>
                  <TabsTrigger value="product">Produk</TabsTrigger>
                  <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      handleDateRangeChange("startDate", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Tanggal Akhir</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      handleDateRangeChange("endDate", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="employeeFilter">Filter Karyawan</Label>
                  <Select
                    value={employeeOnly ? "true" : "false"}
                    onValueChange={(value) =>
                      handleEmployeeFilterChange(value === "true")
                    }
                  >
                    <SelectTrigger id="employeeFilter" className="mt-1">
                      <SelectValue placeholder="Pilih filter karyawan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Semua Aktivitas</SelectItem>
                      <SelectItem value="true">Hanya Aktivitas Karyawan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Activity List */}
            <div className="space-y-4">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </div>
              ) : activities.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-lg font-medium mb-1">Tidak ada aktivitas</h3>
                  <p className="text-sm">
                    Tidak ada aktivitas yang ditemukan dengan filter yang dipilih
                  </p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={getActivityColor(activity.type)}
                        >
                          {activity.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {activity.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          oleh{" "}
                          <span className="font-medium">
                            {activity.performedBy}
                          </span>
                        </span>
                        {activity.isEmployee && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            Karyawan
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {!loading && !error && totalPages > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Menampilkan {activities.length} dari {totalCount} aktivitas
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
