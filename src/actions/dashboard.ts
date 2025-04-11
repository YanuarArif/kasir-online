"use server";

import { db } from "@/lib/prisma";
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";

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
