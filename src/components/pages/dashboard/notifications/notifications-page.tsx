"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  BellIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  getFilteredNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NotificationItem,
  NotificationType,
  NotificationFilters,
} from "@/actions/notifications";

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<NotificationType | "all">("all");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
  const [readStatus, setReadStatus] = useState<"all" | "read" | "unread">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const fetchNotifications = async (page: number = 1, filters?: NotificationFilters) => {
    setLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const result = await getFilteredNotifications({
        limit: ITEMS_PER_PAGE,
        offset,
        filters,
      });

      if (result.success && result.data) {
        setNotifications(result.data);
        setTotalCount(result.totalCount || 0);
        setError(null);
      } else {
        setError(result.error || "Gagal mengambil notifikasi");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil notifikasi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters: NotificationFilters = {
      type: activeTab !== "all" ? activeTab : undefined,
      startDate: dateRange.startDate ? new Date(dateRange.startDate) : undefined,
      endDate: dateRange.endDate ? new Date(dateRange.endDate) : undefined,
      readStatus: showUnreadOnly ? "unread" : readStatus,
    };
    fetchNotifications(currentPage, filters);
  }, [currentPage, activeTab, dateRange, readStatus, showUnreadOnly]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as NotificationType | "all");
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleDateRangeChange = (
    field: "startDate" | "endDate",
    value: string
  ) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when changing date range
  };

  const handleReadStatusChange = (value: "all" | "read" | "unread") => {
    setReadStatus(value);
    setCurrentPage(1); // Reset to first page when changing read status
  };

  const handleUnreadOnlyChange = (checked: boolean) => {
    setShowUnreadOnly(checked);
    setCurrentPage(1); // Reset to first page when changing unread only
  };

  const handleRefresh = () => {
    const filters: NotificationFilters = {
      type: activeTab !== "all" ? activeTab : undefined,
      startDate: dateRange.startDate ? new Date(dateRange.startDate) : undefined,
      endDate: dateRange.endDate ? new Date(dateRange.endDate) : undefined,
      readStatus: showUnreadOnly ? "unread" : readStatus,
    };
    fetchNotifications(currentPage, filters);
  };

  const handleClearFilters = () => {
    setActiveTab("all");
    setDateRange({ startDate: "", endDate: "" });
    setReadStatus("all");
    setShowUnreadOnly(false);
    setCurrentPage(1);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await markNotificationAsRead(id);
      if (result.success) {
        // Update local state to mark notification as read
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, isRead: true } 
              : notification
          )
        );
        toast.success("Notifikasi ditandai sebagai telah dibaca");
      } else {
        toast.error(result.error || "Gagal menandai notifikasi sebagai telah dibaca");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menandai notifikasi");
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        // Update local state to mark all notifications as read
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        toast.success("Semua notifikasi telah ditandai sebagai dibaca");
        // Refresh to get updated list if we're filtering by read status
        if (readStatus === "unread" || showUnreadOnly) {
          handleRefresh();
        }
      } else {
        toast.error(result.error || "Gagal menandai semua notifikasi sebagai telah dibaca");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menandai semua notifikasi");
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Function to get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "info":
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get notification color based on type
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <BellIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Notifikasi
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Kelola semua notifikasi dan pemberitahuan
          </p>
        </div>
      </div>

      <div className="px-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Daftar Notifikasi</CardTitle>
                <CardDescription>
                  Semua notifikasi dan pemberitahuan sistem
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="h-8"
                  >
                    Tandai Semua Dibaca
                  </Button>
                )}
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
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="warning">Peringatan</TabsTrigger>
                  <TabsTrigger value="success">Sukses</TabsTrigger>
                  <TabsTrigger value="error">Error</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Label htmlFor="readStatus">Status Dibaca</Label>
                  <Select
                    value={readStatus}
                    onValueChange={(value) =>
                      handleReadStatusChange(value as "all" | "read" | "unread")
                    }
                    disabled={showUnreadOnly}
                  >
                    <SelectTrigger id="readStatus" className="mt-1">
                      <SelectValue placeholder="Pilih status dibaca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="read">Sudah Dibaca</SelectItem>
                      <SelectItem value="unread">Belum Dibaca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2 mt-1">
                    <Switch
                      id="unread-only"
                      checked={showUnreadOnly}
                      onCheckedChange={handleUnreadOnlyChange}
                    />
                    <Label htmlFor="unread-only">Hanya Belum Dibaca</Label>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Notification List */}
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
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <BellIcon className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-lg font-medium mb-1">Tidak ada notifikasi</h3>
                  <p className="text-sm">
                    Tidak ada notifikasi yang ditemukan dengan filter yang dipilih
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      !notification.isRead ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={getNotificationColor(notification.type)}
                        >
                          {notification.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.timestamp}
                        </span>
                        {!notification.isRead && (
                          <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            Belum Dibaca
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-7 text-xs"
                          >
                            Tandai Dibaca
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {!loading && !error && totalPages > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Menampilkan {notifications.length} dari {totalCount} notifikasi
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
