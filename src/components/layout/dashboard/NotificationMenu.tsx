"use client";

import React, { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead, NotificationItem } from "@/actions/notifications";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";

const NotificationMenu = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await getNotifications(5);
      if (result.success && result.data) {
        setNotifications(result.data);
        setUnreadCount(result.data.filter(n => !n.isRead).length);
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
    fetchNotifications();
  }, []);

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
        setUnreadCount(prev => Math.max(0, prev - 1));
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
        setUnreadCount(0);
        toast.success("Semua notifikasi telah ditandai sebagai dibaca");
      } else {
        toast.error(result.error || "Gagal menandai semua notifikasi sebagai telah dibaca");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menandai semua notifikasi");
      console.error(err);
    }
  };

  // Function to get icon color based on notification type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "info":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
      case "warning":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
      case "success":
        return "text-green-500 bg-green-100 dark:bg-green-900/20";
      case "error":
        return "text-red-500 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          aria-label="Notifikasi"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex justify-between items-center p-2">
          <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={handleMarkAllAsRead}
            >
              Tandai Semua Dibaca
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-2 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">Tidak ada notifikasi</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className={`flex flex-col items-start p-3 cursor-default ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
              onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start w-full">
                <div className={`mr-2 px-1.5 py-0.5 rounded-md ${getNotificationColor(notification.type)}`}>
                  <span className="text-xs font-medium uppercase">{notification.type}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{notification.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                </div>
                {!notification.isRead && (
                  <div className="ml-2 h-2 w-2 rounded-full bg-blue-500"></div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        
        <DropdownMenuSeparator />
        <Link href="/dashboard/settings/notifications" passHref>
          <DropdownMenuItem className="cursor-pointer justify-center">
            <span className="text-sm font-medium">Lihat Semua Notifikasi</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
