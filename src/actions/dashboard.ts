"use server";

import { db } from "@/lib/prisma";
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  formatISO,
  eachMonthOfInterval,
  subYears,
  format,
  formatDistanceToNowStrict,
} from "date-fns";
import { id } from "date-fns/locale"; // For Indonesian locale formatting
import { Prisma } from "@prisma/client";

// Helper function to calculate percentage change
const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0; // Avoid division by zero, return 100% if previous was 0 and current is positive
  }
  return Math.round(((current - previous) / previous) * 100);
};

// --- Type Definitions for New Data ---

// Type for Sales Chart Data Point
export type SalesChartDataPoint = {
  name: string; // Month abbreviation e.g., "Jan"
  total: number;
};

// Type for Product Distribution Data Point
export type ProductDistributionDataPoint = {
  name: string; // Category name
  value: number; // Count or value
};

// Type for Recent Transaction Item
export type RecentTransactionItem = {
  id: string; // Sale ID or Invoice Number
  time: string; // Formatted time ago (e.g., "10 menit lalu")
  amount: string; // Formatted currency string
  status: "success" | "pending" | "failed"; // Assuming Sale has a status or can be inferred
};

// --- Server Actions ---

export const getDashboardSummary = async () => {
  try {
    const now = new Date();

    // --- Sales Data ---
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const yesterdayStart = startOfDay(subDays(now, 1));
    const yesterdayEnd = endOfDay(subDays(now, 1));

    const salesTodayResult = await db.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        saleDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
    const salesToday = salesTodayResult._sum.totalAmount ?? 0;

    const salesYesterdayResult = await db.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        saleDate: {
          gte: yesterdayStart,
          lte: yesterdayEnd,
        },
      },
    });
    const salesYesterday = salesYesterdayResult._sum.totalAmount ?? 0;
    // Convert Decimal to number before calculating change
    const salesChange = calculatePercentageChange(
      Number(salesToday),
      Number(salesYesterday)
    );

    // --- Product Data ---
    // Assuming 'active' means all products for now
    const totalProducts = await db.product.count();
    // New products in the last 7 days
    const sevenDaysAgo = subDays(now, 7);
    const newProductsCount = await db.product.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // --- Customer Data ---
    const totalCustomers = await db.customer.count();
    // New customers in the last 7 days
    const newCustomersCount = await db.customer.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // --- Purchase Data ---
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const purchasesThisMonthResult = await db.purchase.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        purchaseDate: {
          gte: thisMonthStart,
          lte: thisMonthEnd,
        },
      },
    });
    const purchasesThisMonth = purchasesThisMonthResult._sum.totalAmount ?? 0;

    const purchasesLastMonthResult = await db.purchase.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        purchaseDate: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });
    const purchasesLastMonth = purchasesLastMonthResult._sum.totalAmount ?? 0;
    // Convert Decimal to number before calculating change
    const purchasesChange = calculatePercentageChange(
      Number(purchasesThisMonth),
      Number(purchasesLastMonth)
    );

    return {
      success: true,
      // Ensure only plain objects/primitives are returned
      data: {
        salesToday: Number(salesToday), // Convert Decimal to number
        salesChange, // Already a number
        totalProducts, // Already a number
        newProductsCount, // Already a number
        totalCustomers, // Already a number
        newCustomersCount, // Already a number
        purchasesThisMonth: Number(purchasesThisMonth), // Convert Decimal to number
        purchasesChange, // Already a number
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return {
      success: false,
      error: "Gagal mengambil data ringkasan dashboard.",
    };
  }
};

// --- Action to get Sales Chart Data (Last 6 Months) ---
export const getSalesChartData = async (): Promise<{
  success: boolean;
  data?: SalesChartDataPoint[];
  error?: string;
}> => {
  try {
    const now = new Date();
    // Go back 5 months to get a total of 6 months including the current one
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));
    const currentMonthEnd = endOfMonth(now);

    const monthlySales = await db.sale.groupBy({
      by: ["saleDate"],
      _sum: {
        totalAmount: true,
      },
      where: {
        saleDate: {
          gte: sixMonthsAgo,
          lte: currentMonthEnd,
        },
      },
      orderBy: {
        saleDate: "asc",
      },
    });

    // Aggregate sales by month
    const salesByMonth: { [key: string]: number } = {};
    monthlySales.forEach((sale) => {
      const monthKey = format(sale.saleDate, "yyyy-MM");
      const amount = Number(sale._sum.totalAmount ?? 0);
      salesByMonth[monthKey] = (salesByMonth[monthKey] ?? 0) + amount;
    });

    // Create data points for the last 6 months, filling missing months with 0
    const monthsInterval = eachMonthOfInterval({
      start: sixMonthsAgo,
      end: now,
    });

    const chartData: SalesChartDataPoint[] = monthsInterval.map((monthDate) => {
      const monthKey = format(monthDate, "yyyy-MM");
      const monthName = format(monthDate, "MMM", { locale: id }); // e.g., "Jan"
      return {
        name: monthName,
        total: salesByMonth[monthKey] ?? 0,
      };
    });

    return { success: true, data: chartData };
  } catch (error) {
    console.error("Error fetching sales chart data:", error);
    return { success: false, error: "Gagal mengambil data grafik penjualan." };
  }
};

// --- Action to get Product Distribution Data (By Category) ---
// NOTE: This assumes a 'category' field exists on the Product model.
// If not, this needs adjustment based on the actual schema.
export const getProductDistributionData = async (): Promise<{
  success: boolean;
  data?: ProductDistributionDataPoint[];
  error?: string;
}> => {
  try {
    // Group products by categoryId and count them
    const distribution = await db.product.groupBy({
      by: ["categoryId"],
      _count: {
        _all: true, // Correct way to count items in the group
      },
      orderBy: {
        _count: {
          categoryId: "desc", // Order by count descending
        },
      },
    });

    // Get the distinct category IDs from the distribution result
    const categoryIds = distribution
      .map((item) => item.categoryId)
      .filter((id): id is string => id !== null); // Filter out null categoryIds

    // Fetch the corresponding category names
    const categories = await db.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Create a map for quick lookup of category names by ID
    const categoryNameMap = new Map(
      categories.map((cat) => [cat.id, cat.name])
    );

    // Map the distribution data to the required chart format
    let chartData: ProductDistributionDataPoint[] = distribution.map(
      (item) => ({
        name: item.categoryId
          ? (categoryNameMap.get(item.categoryId) ?? "Kategori Tidak Dikenal")
          : "Tanpa Kategori", // Handle null categoryId or missing category name
        value: item._count._all, // Use the correct count
      })
    );

    // Optional: Limit to top N categories + 'Lainnya' if too many categories
    const MAX_CATEGORIES = 5;
    if (chartData.length > MAX_CATEGORIES) {
      // Sort by value descending to ensure top categories are selected
      chartData.sort((a, b) => b.value - a.value);
      const topCategories = chartData.slice(0, MAX_CATEGORIES - 1);
      const otherCount = chartData
        .slice(MAX_CATEGORIES - 1)
        .reduce((sum, cat) => sum + cat.value, 0);
      // Add "Lainnya" only if there's actually a count > 0
      if (otherCount > 0) {
        chartData = [...topCategories, { name: "Lainnya", value: otherCount }];
      } else {
        chartData = topCategories;
      }
    }

    return { success: true, data: chartData };
  } catch (error) {
    console.error("Error fetching product distribution data:", error);
    return {
      success: false,
      error: "Gagal mengambil data distribusi produk.",
    };
  }
};

// --- Action to get Recent Transactions (Last 5 Sales) ---
export const getRecentTransactions = async (): Promise<{
  success: boolean;
  data?: RecentTransactionItem[];
  error?: string;
}> => {
  try {
    const recentSales = await db.sale.findMany({
      take: 5,
      orderBy: {
        saleDate: "desc",
      },
      select: {
        id: true, // Assuming 'id' can serve as the transaction ID/invoice
        saleDate: true,
        totalAmount: true,
        // Add status if available, e.g., status: true
      },
    });

    // Helper to format currency locally within the action
    const formatCurrencyLocal = (value: number | Prisma.Decimal) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value));
    };

    const transactions: RecentTransactionItem[] = recentSales.map((sale) => ({
      id: sale.id, // Use sale ID or a specific invoice number field if exists
      time: formatDistanceToNowStrict(sale.saleDate, {
        addSuffix: true,
        locale: id,
      }), // e.g., "10 menit yang lalu"
      amount: formatCurrencyLocal(sale.totalAmount),
      status: "success", // Assuming all fetched sales are 'success'. Adjust if status field exists.
    }));

    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    return { success: false, error: "Gagal mengambil transaksi terkini." };
  }
};
