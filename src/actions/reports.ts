"use server";

import { db } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { startOfDay, endOfDay, subDays, format, parseISO } from "date-fns";

// Helper function to get date range based on selection
const getDateRange = (dateRange: string) => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = endOfDay(now);

  switch (dateRange) {
    case "today":
      startDate = startOfDay(now);
      break;
    case "7d":
      startDate = startOfDay(subDays(now, 7));
      break;
    case "30d":
      startDate = startOfDay(subDays(now, 30));
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      // Default to 30 days
      startDate = startOfDay(subDays(now, 30));
  }

  return { startDate, endDate };
};

// Function to get purchase report data
export const getPurchaseReportData = async (dateRange: string) => {
  try {
    // Get effective user ID (owner ID if employee, user's own ID otherwise)
    const effectiveUserId = await getEffectiveUserId();

    if (!effectiveUserId) {
      return { error: "Tidak terautentikasi!" };
    }

    const { startDate, endDate } = getDateRange(dateRange);

    // Fetch purchases within the date range
    const purchases = await db.purchase.findMany({
      where: {
        userId: effectiveUserId,
        purchaseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        supplier: {
          select: {
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        purchaseDate: "desc",
      },
    });

    // Transform the data to match the expected format
    const purchaseData = purchases.map((purchase) => {
      // Count total items
      const totalItems = purchase.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        id: purchase.id,
        date: purchase.purchaseDate.toISOString(),
        supplier: purchase.supplier?.name || "Tidak ada supplier",
        items: totalItems,
        total: purchase.totalAmount.toNumber(),
        invoiceRef: purchase.invoiceRef || "-",
      };
    });

    return {
      success: true,
      data: purchaseData,
    };
  } catch (error) {
    console.error("Error fetching purchase report data:", error);
    return {
      error: "Gagal mengambil data laporan pembelian.",
    };
  }
};

// Function to get sales report data
export const getSalesReportData = async (dateRange: string) => {
  try {
    const effectiveUserId = await getEffectiveUserId();
    if (!effectiveUserId) {
      return { error: "Tidak terautentikasi!" };
    }

    const { startDate, endDate } = getDateRange(dateRange);

    const sales = await db.sale.findMany({
      where: {
        userId: effectiveUserId,
        saleDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true, // Include the full items relation
      },
      orderBy: {
        saleDate: "desc",
      },
    });

    const salesData = sales.map((sale) => {
      const totalItems = sale.items.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      );
      return {
        id: sale.id,
        date: sale.saleDate.toISOString(),
        customer: "Pelanggan Umum", // Defaulting as customer is not directly linked
        items: totalItems,
        total: sale.totalAmount.toNumber(),
        // paymentMethod is not available on the Sale model
      };
    });

    return {
      success: true,
      data: salesData,
    };
  } catch (error) {
    console.error("Error fetching sales report data:", error);
    return {
      error: "Gagal mengambil data laporan penjualan.",
    };
  }
};

// Function to get product report data
export const getProductReportData = async (dateRange: string) => {
  try {
    const effectiveUserId = await getEffectiveUserId();
    if (!effectiveUserId) {
      return { error: "Tidak terautentikasi!" };
    }

    const { startDate, endDate } = getDateRange(dateRange);

    // Fetch all products for the user
    const products = await db.product.findMany({
      where: {
        userId: effectiveUserId,
      },
      include: {
        category: {
          select: { name: true },
        },
        saleItems: {
          where: {
            sale: {
              saleDate: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          select: {
            quantity: true,
            priceAtSale: true,
          },
        },
        // We might need purchaseItems if we want to calculate profit based on costAtPurchase
        // purchaseItems: {
        //   where: { purchase: { purchaseDate: { gte: startDate, lte: endDate } } },
        //   select: { quantity: true, costAtPurchase: true }
        // }
      },
    });

    const productData = products.map((product) => {
      const totalSold = product.saleItems.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      );
      const totalRevenue = product.saleItems.reduce(
        (sum: number, item: { quantity: number; priceAtSale: any }) =>
          sum + item.quantity * item.priceAtSale.toNumber(),
        0
      );
      // Basic profit calculation (Revenue - Cost * Sold). Requires cost on Product model.
      const totalCost = product.cost ? product.cost.toNumber() * totalSold : 0;
      const totalProfit = totalRevenue - totalCost;

      return {
        id: product.id,
        name: product.name,
        category: product.category?.name || "Tidak ada kategori",
        stock: product.stock,
        sold: totalSold,
        revenue: totalRevenue,
        profit: totalProfit, // This depends on having a 'cost' field on the Product model
      };
    });

    return {
      success: true,
      data: productData,
    };
  } catch (error) {
    console.error("Error fetching product report data:", error);
    return {
      error: "Gagal mengambil data laporan produk.",
    };
  }
};

// Function to get purchase chart data
export const getPurchaseChartData = async (dateRange: string) => {
  try {
    // Get effective user ID (owner ID if employee, user's own ID otherwise)
    const effectiveUserId = await getEffectiveUserId();

    if (!effectiveUserId) {
      return { error: "Tidak terautentikasi!" };
    }

    const { startDate, endDate } = getDateRange(dateRange);

    // Fetch purchases within the date range
    const purchases = await db.purchase.findMany({
      where: {
        userId: effectiveUserId,
        purchaseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        supplier: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        purchaseDate: "asc",
      },
    });

    // Group purchases by month for trend chart
    const monthlyData = new Map<string, number>();
    purchases.forEach((purchase) => {
      const month = format(purchase.purchaseDate, "MMM");
      const currentTotal = monthlyData.get(month) || 0;
      monthlyData.set(month, currentTotal + purchase.totalAmount.toNumber());
    });

    const trendData = Array.from(monthlyData.entries()).map(
      ([name, total]) => ({
        name,
        total,
      })
    );

    // Group purchases by supplier for pie chart
    const supplierData = new Map<string, number>();
    purchases.forEach((purchase) => {
      const supplierName = purchase.supplier?.name || "Tidak ada supplier";
      const currentTotal = supplierData.get(supplierName) || 0;
      supplierData.set(
        supplierName,
        currentTotal + purchase.totalAmount.toNumber()
      );
    });

    const supplierChartData = Array.from(supplierData.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return {
      success: true,
      data: {
        trendData,
        supplierData: supplierChartData,
      },
    };
  } catch (error) {
    console.error("Error fetching purchase chart data:", error);
    return {
      error: "Gagal mengambil data grafik pembelian.",
    };
  }
};
