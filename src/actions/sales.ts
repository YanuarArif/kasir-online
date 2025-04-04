"use server";

import { z } from "zod";
import { SaleSchema } from "@/schemas/zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export const addSale = async (values: z.infer<typeof SaleSchema>) => {
  // Get current session
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = user.id;

  // 1. Validate input server-side
  const validatedFields = SaleSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const { items, totalAmount } = validatedFields.data;

  try {
    // 2. Create sale in database with transaction to ensure all operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Create the sale record
      const sale = await tx.sale.create({
        data: {
          totalAmount,
          userId,
          items: {
            create: items.map((item) => ({
              quantity: item.quantity,
              priceAtSale: item.priceAtSale,
              productId: item.productId,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update product stock for each item sold
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return sale;
    });

    // 3. Revalidate the sales page cache
    revalidatePath("/dashboard/sales");

    return { 
      success: "Penjualan berhasil dicatat!",
      data: result
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal mencatat penjualan. Silakan coba lagi." };
  }
};

export const getSales = async () => {
  // Get current session
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Tidak terautentikasi!" };
  }

  try {
    const sales = await db.sale.findMany({
      where: {
        userId,
      },
      orderBy: {
        saleDate: "desc",
      },
      include: {
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
    });

    // Convert Decimal to number for serialization
    const serializedSales = sales.map((sale) => ({
      ...sale,
      totalAmount: sale.totalAmount.toNumber(),
      items: sale.items.map((item) => ({
        ...item,
        priceAtSale: item.priceAtSale.toNumber(),
      })),
    }));

    return { sales: serializedSales };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal mengambil data penjualan." };
  }
};

export const getSaleById = async (id: string) => {
  // Get current session
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Tidak terautentikasi!" };
  }

  try {
    const sale = await db.sale.findUnique({
      where: {
        id,
        userId, // Ensure the sale belongs to the current user
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      return { error: "Penjualan tidak ditemukan." };
    }

    // Convert Decimal to number for serialization
    const serializedSale = {
      ...sale,
      totalAmount: sale.totalAmount.toNumber(),
      items: sale.items.map((item) => ({
        ...item,
        priceAtSale: item.priceAtSale.toNumber(),
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
          cost: item.product.cost ? item.product.cost.toNumber() : null,
        },
      })),
    };

    return { sale: serializedSale };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal mengambil detail penjualan." };
  }
};
