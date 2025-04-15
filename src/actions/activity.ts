"use server";

import { db } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { formatDistanceToNowStrict } from "date-fns";
import { id } from "date-fns/locale";

export type ActivityType = "sale" | "purchase" | "product" | "login";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string; // Formatted time ago (e.g., "10 menit lalu")
  performedBy: string; // User or employee name
  isEmployee: boolean;
};

export interface ActivityFilters {
  type?: ActivityType | "all";
  startDate?: Date;
  endDate?: Date;
  employeeOnly?: boolean;
}

export interface PaginatedActivitiesResult {
  success: boolean;
  data?: ActivityItem[];
  totalCount?: number;
  error?: string;
}

export const getRecentActivities = async (
  limit: number = 10
): Promise<{
  success: boolean;
  data?: ActivityItem[];
  error?: string;
}> => {
  return getActivities({ limit });
};

export const getActivities = async (
  options: {
    limit?: number;
    offset?: number;
    filters?: ActivityFilters;
  } = {}
): Promise<PaginatedActivitiesResult> => {
  try {
    const effectiveUserId = await getEffectiveUserId();

    if (!effectiveUserId) {
      return { success: false, error: "Tidak terautentikasi!" };
    }

    // Get recent sales (including those by employees)
    const recentSales = await db.sale.findMany({
      take: options.limit || 10,
      where: {
        userId: effectiveUserId,
      },
      orderBy: {
        saleDate: "desc",
      },
      include: {
        Employee: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get recent purchases
    const recentPurchases = await db.purchase.findMany({
      take: options.limit || 10,
      where: {
        userId: effectiveUserId,
      },
      orderBy: {
        purchaseDate: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get recent product changes
    const recentProducts = await db.product.findMany({
      take: options.limit || 10,
      where: {
        userId: effectiveUserId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Combine and format activities
    const salesActivities: ActivityItem[] = recentSales.map((sale) => ({
      id: sale.id,
      type: "sale",
      description: `Penjualan baru sebesar ${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(sale.totalAmount))}`,
      timestamp: formatDistanceToNowStrict(sale.saleDate, {
        addSuffix: true,
        locale: id,
      }),
      performedBy: sale.Employee?.name || sale.user.name || "Pengguna",
      isEmployee: !!sale.employeeId,
    }));

    const purchaseActivities: ActivityItem[] = recentPurchases.map(
      (purchase) => ({
        id: purchase.id,
        type: "purchase",
        description: `Pembelian baru sebesar ${new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(purchase.totalAmount))}`,
        timestamp: formatDistanceToNowStrict(purchase.purchaseDate, {
          addSuffix: true,
          locale: id,
        }),
        performedBy: purchase.user.name || "Pengguna",
        isEmployee: false,
      })
    );

    const productActivities: ActivityItem[] = recentProducts.map((product) => ({
      id: product.id,
      type: "product",
      description: `Produk "${product.name}" diperbarui`,
      timestamp: formatDistanceToNowStrict(product.updatedAt, {
        addSuffix: true,
        locale: id,
      }),
      performedBy: product.user.name || "Pengguna",
      isEmployee: false,
    }));

    // Combine all activities
    let allActivities = [
      ...salesActivities,
      ...purchaseActivities,
      ...productActivities,
    ];

    // Create a mapping of activities to their original dates for filtering and sorting
    const activityDates = new Map();

    // Store original dates for sales
    recentSales.forEach((sale) => {
      const activities = salesActivities.filter((a) => a.id === sale.id);
      activities.forEach((activity) => {
        activityDates.set(activity.id, sale.saleDate);
      });
    });

    // Store original dates for purchases
    recentPurchases.forEach((purchase) => {
      const activities = purchaseActivities.filter((a) => a.id === purchase.id);
      activities.forEach((activity) => {
        activityDates.set(activity.id, purchase.purchaseDate);
      });
    });

    // Store original dates for products
    recentProducts.forEach((product) => {
      const activities = productActivities.filter((a) => a.id === product.id);
      activities.forEach((activity) => {
        activityDates.set(activity.id, product.updatedAt);
      });
    });

    // Apply filters if provided
    if (options.filters) {
      const { type, startDate, endDate, employeeOnly } = options.filters;

      if (type && type !== "all") {
        allActivities = allActivities.filter(
          (activity) => activity.type === type
        );
      }

      // We already have the activityDates map created above

      // Apply date filters using the original dates
      if (startDate) {
        allActivities = allActivities.filter((activity) => {
          const originalDate = activityDates.get(activity.id);
          return originalDate && originalDate >= startDate;
        });
      }

      if (endDate) {
        allActivities = allActivities.filter((activity) => {
          const originalDate = activityDates.get(activity.id);
          return originalDate && originalDate <= endDate;
        });
      }

      if (employeeOnly) {
        allActivities = allActivities.filter((activity) => activity.isEmployee);
      }
    }

    // Use the activity dates map for sorting

    // Sort activities by the actual dates
    allActivities.sort((a, b) => {
      const aDate = activityDates.get(a.id);
      const bDate = activityDates.get(b.id);

      if (!aDate || !bDate) return 0;

      return bDate.getTime() - aDate.getTime();
    });

    // Get total count for pagination
    const totalCount = allActivities.length;

    // Apply pagination
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    const paginatedActivities = allActivities.slice(offset, offset + limit);

    return { success: true, data: paginatedActivities, totalCount };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return { success: false, error: "Gagal mengambil aktivitas terkini." };
  }
};
