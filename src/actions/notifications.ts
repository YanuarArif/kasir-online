"use server";

import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { formatDistanceToNowStrict } from "date-fns";
import { id } from "date-fns/locale";
import { db } from "@/lib/prisma";
import { NotificationType as PrismaNotificationType } from "@prisma/client";

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

// Helper function to convert Prisma NotificationType to our NotificationType
const mapNotificationType = (
  type: PrismaNotificationType
): NotificationType => {
  return type.toLowerCase() as NotificationType;
};

// Helper function to format notification timestamp
const formatNotificationTimestamp = (date: Date): string => {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: id,
  });
};

// Get notifications with optional limit
export const getNotifications = async (
  limit: number = 10
): Promise<{
  success: boolean;
  data?: NotificationItem[];
  error?: string;
}> => {
  return getFilteredNotifications({ limit });
};

// Get filtered notifications with pagination
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

    // Build the where clause for filtering
    const where: any = { userId: effectiveUserId };

    // Apply filters if provided
    if (options.filters) {
      const { type, readStatus, startDate, endDate } = options.filters;

      // Filter by type
      if (type && type !== "all") {
        where.type = type.toUpperCase();
      }

      // Filter by read status
      if (readStatus && readStatus !== "all") {
        where.isRead = readStatus === "read";
      }

      // Filter by date range
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }
    }

    // Get total count for pagination
    const totalCount = await db.notification.count({ where });

    // Apply pagination
    const limit = options.limit || 10;
    const offset = options.offset || 0;

    // Fetch notifications from database
    const notifications = await db.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc", // Newest first
      },
      skip: offset,
      take: limit,
    });

    // Map database notifications to our NotificationItem type
    const mappedNotifications: NotificationItem[] = notifications.map(
      (notification) => ({
        id: notification.id,
        type: mapNotificationType(notification.type),
        title: notification.title,
        message: notification.message,
        timestamp: formatNotificationTimestamp(notification.createdAt),
        isRead: notification.isRead,
      })
    );

    return {
      success: true,
      data: mappedNotifications,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Gagal mengambil notifikasi." };
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const effectiveUserId = await getEffectiveUserId();

    if (!effectiveUserId) {
      return { success: false, error: "Tidak terautentikasi!" };
    }

    // Update the notification in the database
    await db.notification.updateMany({
      where: {
        id,
        userId: effectiveUserId,
      },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return {
      success: false,
      error: "Gagal menandai notifikasi sebagai telah dibaca.",
    };
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const effectiveUserId = await getEffectiveUserId();

    if (!effectiveUserId) {
      return { success: false, error: "Tidak terautentikasi!" };
    }

    // Update all notifications in the database
    await db.notification.updateMany({
      where: {
        userId: effectiveUserId,
        isRead: false,
      },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return {
      success: false,
      error: "Gagal menandai semua notifikasi sebagai telah dibaca.",
    };
  }
};

// Create a new notification
export const createNotification = async (data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}): Promise<{
  success: boolean;
  data?: { id: string };
  error?: string;
}> => {
  try {
    // Convert notification type to Prisma enum
    const type = data.type.toUpperCase() as PrismaNotificationType;

    // Create notification in database
    const notification = await db.notification.create({
      data: {
        userId: data.userId,
        type,
        title: data.title,
        message: data.message,
      },
    });

    return {
      success: true,
      data: { id: notification.id },
    };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Gagal membuat notifikasi." };
  }
};
