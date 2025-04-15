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

// This is a mock implementation since there's no notifications table in the database yet
// In a real application, you would fetch this from a notifications table
export const getNotifications = async (limit: number = 10): Promise<{
  success: boolean;
  data?: NotificationItem[];
  error?: string;
}> => {
  try {
    const effectiveUserId = await getEffectiveUserId();
    
    if (!effectiveUserId) {
      return { success: false, error: "Tidak terautentikasi!" };
    }

    // Mock notifications - in a real app, these would come from the database
    const mockNotifications: NotificationItem[] = [
      {
        id: "1",
        type: "warning",
        title: "Stok Menipis",
        message: "Beberapa produk hampir habis stoknya. Segera lakukan pembelian.",
        timestamp: formatDistanceToNowStrict(new Date(Date.now() - 1000 * 60 * 30), {
          addSuffix: true,
          locale: id,
        }),
        isRead: false,
      },
      {
        id: "2",
        type: "success",
        title: "Penjualan Berhasil",
        message: "Penjualan baru telah berhasil dicatat.",
        timestamp: formatDistanceToNowStrict(new Date(Date.now() - 1000 * 60 * 60 * 2), {
          addSuffix: true,
          locale: id,
        }),
        isRead: true,
      },
      {
        id: "3",
        type: "info",
        title: "Pembaruan Sistem",
        message: "Sistem akan diperbarui pada tanggal 15 bulan ini.",
        timestamp: formatDistanceToNowStrict(new Date(Date.now() - 1000 * 60 * 60 * 24), {
          addSuffix: true,
          locale: id,
        }),
        isRead: false,
      },
      {
        id: "4",
        type: "error",
        title: "Gagal Sinkronisasi",
        message: "Terjadi kesalahan saat menyinkronkan data.",
        timestamp: formatDistanceToNowStrict(new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), {
          addSuffix: true,
          locale: id,
        }),
        isRead: true,
      },
      {
        id: "5",
        type: "info",
        title: "Karyawan Baru",
        message: "Karyawan baru telah ditambahkan ke sistem.",
        timestamp: formatDistanceToNowStrict(new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), {
          addSuffix: true,
          locale: id,
        }),
        isRead: false,
      },
    ];

    return { success: true, data: mockNotifications.slice(0, limit) };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Gagal mengambil notifikasi." };
  }
};

// Mock function to mark a notification as read
export const markNotificationAsRead = async (id: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // In a real app, this would update the database
    console.log(`Marking notification ${id} as read`);
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Gagal menandai notifikasi sebagai telah dibaca." };
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
    return { success: false, error: "Gagal menandai semua notifikasi sebagai telah dibaca." };
  }
};
