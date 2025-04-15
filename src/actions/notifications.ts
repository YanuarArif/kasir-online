"use server";

import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { formatDistanceToNowStrict } from "date-fns";
import { id } from "date-fns/locale";

export type NotificationType = "info" | "warning" | "success" | "error";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // Formatted time ago (e.g., "10 menit lalu")
  isRead: boolean;
};

export interface NotificationFilters {
  type?: NotificationType | "all";
  startDate?: Date;
  endDate?: Date;
  readStatus?: "all" | "read" | "unread";
}

export interface PaginatedNotificationsResult {
  success: boolean;
  data?: NotificationItem[];
  totalCount?: number;
  error?: string;
}

// This is a mock implementation since there's no notifications table in the database yet
// In a real application, you would fetch this from a notifications table
export const getNotifications = async (
  limit: number = 10
): Promise<{
  success: boolean;
  data?: NotificationItem[];
  error?: string;
}> => {
  return getFilteredNotifications({ limit });
};

export const getFilteredNotifications = async (
  options: {
    limit?: number;
    offset?: number;
    filters?: NotificationFilters;
  } = {}
): Promise<PaginatedNotificationsResult> => {
  try {
    const effectiveUserId = await getEffectiveUserId();

    if (!effectiveUserId) {
      return { success: false, error: "Tidak terautentikasi!" };
    }

    // Generate more mock notifications for pagination demo
    const mockNotifications: NotificationItem[] = generateMockNotifications();

    // Create a mapping of notifications to their actual dates for filtering
    const notificationDates = new Map<string, Date>();
    mockNotifications.forEach((notification) => {
      // Extract the actual date from the relative timestamp (this is a simplification)
      // In a real app, you'd store the actual date in the database
      const relativeTimeMatch = notification.timestamp.match(
        /(\d+)\s+(detik|menit|jam|hari|minggu|bulan|tahun)/i
      );
      let date = new Date();

      if (relativeTimeMatch) {
        const amount = parseInt(relativeTimeMatch[1]);
        const unit = relativeTimeMatch[2].toLowerCase();

        switch (unit) {
          case "detik":
            date = new Date(Date.now() - amount * 1000);
            break;
          case "menit":
            date = new Date(Date.now() - amount * 60 * 1000);
            break;
          case "jam":
            date = new Date(Date.now() - amount * 60 * 60 * 1000);
            break;
          case "hari":
            date = new Date(Date.now() - amount * 24 * 60 * 60 * 1000);
            break;
          case "minggu":
            date = new Date(Date.now() - amount * 7 * 24 * 60 * 60 * 1000);
            break;
          case "bulan":
            date = new Date(Date.now() - amount * 30 * 24 * 60 * 60 * 1000);
            break;
          case "tahun":
            date = new Date(Date.now() - amount * 365 * 24 * 60 * 60 * 1000);
            break;
        }
      }

      notificationDates.set(notification.id, date);
    });

    // Apply filters if provided
    let filteredNotifications = [...mockNotifications];

    if (options.filters) {
      const { type, startDate, endDate, readStatus } = options.filters;

      if (type && type !== "all") {
        filteredNotifications = filteredNotifications.filter(
          (notification) => notification.type === type
        );
      }

      if (startDate) {
        filteredNotifications = filteredNotifications.filter((notification) => {
          const notificationDate = notificationDates.get(notification.id);
          return notificationDate && notificationDate >= startDate;
        });
      }

      if (endDate) {
        filteredNotifications = filteredNotifications.filter((notification) => {
          const notificationDate = notificationDates.get(notification.id);
          return notificationDate && notificationDate <= endDate;
        });
      }

      if (readStatus && readStatus !== "all") {
        filteredNotifications = filteredNotifications.filter((notification) =>
          readStatus === "read" ? notification.isRead : !notification.isRead
        );
      }
    }

    // Sort notifications by date (newest first)
    filteredNotifications.sort((a, b) => {
      const aDate = notificationDates.get(a.id);
      const bDate = notificationDates.get(b.id);

      if (!aDate || !bDate) return 0;

      return bDate.getTime() - aDate.getTime();
    });

    // Get total count for pagination
    const totalCount = filteredNotifications.length;

    // Apply pagination
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    const paginatedNotifications = filteredNotifications.slice(
      offset,
      offset + limit
    );

    return { success: true, data: paginatedNotifications, totalCount };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Gagal mengambil notifikasi." };
  }
};

// Helper function to generate mock notifications
function generateMockNotifications(): NotificationItem[] {
  const baseNotifications = [
    {
      id: "1",
      type: "warning" as NotificationType,
      title: "Stok Menipis",
      message:
        "Beberapa produk hampir habis stoknya. Segera lakukan pembelian.",
      timestamp: formatDistanceToNowStrict(
        new Date(Date.now() - 1000 * 60 * 30),
        {
          addSuffix: true,
          locale: id,
        }
      ),
      isRead: false,
    },
    {
      id: "2",
      type: "success" as NotificationType,
      title: "Penjualan Berhasil",
      message: "Penjualan baru telah berhasil dicatat.",
      timestamp: formatDistanceToNowStrict(
        new Date(Date.now() - 1000 * 60 * 60 * 2),
        {
          addSuffix: true,
          locale: id,
        }
      ),
      isRead: true,
    },
    {
      id: "3",
      type: "info" as NotificationType,
      title: "Pembaruan Sistem",
      message: "Sistem akan diperbarui pada tanggal 15 bulan ini.",
      timestamp: formatDistanceToNowStrict(
        new Date(Date.now() - 1000 * 60 * 60 * 24),
        {
          addSuffix: true,
          locale: id,
        }
      ),
      isRead: false,
    },
    {
      id: "4",
      type: "error" as NotificationType,
      title: "Gagal Sinkronisasi",
      message: "Terjadi kesalahan saat menyinkronkan data.",
      timestamp: formatDistanceToNowStrict(
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        {
          addSuffix: true,
          locale: id,
        }
      ),
      isRead: true,
    },
    {
      id: "5",
      type: "info" as NotificationType,
      title: "Karyawan Baru",
      message: "Karyawan baru telah ditambahkan ke sistem.",
      timestamp: formatDistanceToNowStrict(
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        {
          addSuffix: true,
          locale: id,
        }
      ),
      isRead: false,
    },
  ];

  // Generate additional notifications for pagination demo
  const additionalNotifications: NotificationItem[] = [];
  const types: NotificationType[] = ["info", "warning", "success", "error"];
  const titles = [
    "Pembaruan Produk",
    "Perubahan Harga",
    "Stok Diperbarui",
    "Laporan Bulanan",
    "Pengingat Pembayaran",
    "Pembaruan Aplikasi",
    "Permintaan Persetujuan",
    "Transaksi Baru",
    "Pesan dari Admin",
    "Pengumuman Penting",
  ];

  for (let i = 6; i <= 30; i++) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDaysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
    const randomIsRead = Math.random() > 0.5; // 50% chance of being read

    additionalNotifications.push({
      id: i.toString(),
      type: randomType,
      title: randomTitle,
      message: `Ini adalah notifikasi ${randomType} yang dibuat ${randomDaysAgo} hari yang lalu.`,
      timestamp: formatDistanceToNowStrict(
        new Date(Date.now() - 1000 * 60 * 60 * 24 * randomDaysAgo),
        {
          addSuffix: true,
          locale: id,
        }
      ),
      isRead: randomIsRead,
    });
  }

  return [...baseNotifications, ...additionalNotifications];
}

// Mock function to mark a notification as read
export const markNotificationAsRead = async (
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // In a real app, this would update the database
    console.log(`Marking notification ${id} as read`);
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return {
      success: false,
      error: "Gagal menandai notifikasi sebagai telah dibaca.",
    };
  }
};

// Mock function to mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // In a real app, this would update the database
    console.log("Marking all notifications as read");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return {
      success: false,
      error: "Gagal menandai semua notifikasi sebagai telah dibaca.",
    };
  }
};
