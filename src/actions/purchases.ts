"use server";

import { z } from "zod";
import { PurchaseSchema } from "@/schemas/zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { createPurchaseSuccessNotification } from "@/lib/create-system-notification";

export const addPurchase = async (values: z.infer<typeof PurchaseSchema>) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  // 1. Validate input server-side
  const validatedFields = PurchaseSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const {
    items,
    totalAmount,
    invoiceRef,
    supplierId: rawSupplierId,
  } = validatedFields.data;

  // Ensure supplierId is null if it's an empty string or nullish, otherwise use the ID
  const supplierId = rawSupplierId ? rawSupplierId : null;

  try {
    // 2. Create purchase in database with transaction to ensure all operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Create the purchase record
      const purchase = await tx.purchase.create({
        data: {
          totalAmount,
          invoiceRef,
          userId,
          supplierId,
          items: {
            create: items.map((item) => ({
              quantity: item.quantity,
              costAtPurchase: item.costAtPurchase,
              productId: item.productId,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update product stock for each item purchased
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return purchase;
    });

    // 3. Create a notification for the purchase
    await createPurchaseSuccessNotification(
      result.id,
      result.totalAmount.toNumber()
    );

    // 4. Revalidate the purchases page cache
    revalidatePath("/dashboard/purchases");

    // Serialize the result to convert Decimal to number and Date to string
    const serializedResult = {
      id: result.id,
      purchaseDate: result.purchaseDate.toISOString(),
      totalAmount: result.totalAmount.toNumber(),
      invoiceRef: result.invoiceRef,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
      userId: result.userId,
      supplierId: result.supplierId,
      items: result.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        costAtPurchase: item.costAtPurchase.toNumber(),
        purchaseId: item.purchaseId,
        productId: item.productId,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    };

    return {
      success: "Pembelian berhasil dicatat!",
      data: serializedResult,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal mencatat pembelian. Silakan coba lagi." };
  }
};

export const getPurchases = async () => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    const purchases = await db.purchase.findMany({
      where: {
        userId,
      },
      orderBy: {
        purchaseDate: "desc",
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
        supplier: true,
      },
    });

    // Convert Decimal to number and Date to string for serialization
    const serializedPurchases = purchases.map((purchase) => {
      // Explicitly create a new plain object
      const plainPurchase: any = {
        id: purchase.id,
        purchaseDate: purchase.purchaseDate.toISOString(), // Convert Date to ISO string
        totalAmount: purchase.totalAmount.toNumber(), // Convert Decimal to number
        invoiceRef: purchase.invoiceRef,
        createdAt: purchase.createdAt.toISOString(), // Convert Date to ISO string
        updatedAt: purchase.updatedAt.toISOString(), // Convert Date to ISO string
        userId: purchase.userId,
        supplierId: purchase.supplierId,
        // Explicitly handle supplier (it's already plain or null)
        supplier: purchase.supplier
          ? {
              id: purchase.supplier.id,
              name: purchase.supplier.name,
            }
          : null,
        items: purchase.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          costAtPurchase: item.costAtPurchase.toNumber(), // Convert Decimal to number
          purchaseId: item.purchaseId,
          productId: item.productId,
          createdAt: item.createdAt.toISOString(), // Convert Date to ISO string
          updatedAt: item.updatedAt.toISOString(), // Convert Date to ISO string
          // Explicitly handle product name (already plain)
          product: {
            name: item.product.name,
          },
        })),
      };
      return plainPurchase;
    });

    return { purchases: serializedPurchases };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal mengambil data pembelian." };
  }
};

export const getPurchaseById = async (id: string) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    const purchase = await db.purchase.findUnique({
      where: {
        id,
        userId, // Ensure the purchase belongs to the current user
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
      },
    });

    if (!purchase) {
      return { error: "Pembelian tidak ditemukan." };
    }

    // Convert Decimal to number for serialization
    const serializedPurchase = {
      ...purchase,
      totalAmount: purchase.totalAmount.toNumber(),
      items: purchase.items.map((item) => ({
        ...item,
        costAtPurchase: item.costAtPurchase.toNumber(),
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
          cost: item.product.cost ? item.product.cost.toNumber() : null,
        },
      })),
    };

    return { purchase: serializedPurchase };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal mengambil detail pembelian." };
  }
};

export const updatePurchase = async (
  id: string,
  values: z.infer<typeof PurchaseSchema>
) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  // 1. Validate input server-side
  const validatedFields = PurchaseSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const {
    items,
    totalAmount,
    invoiceRef,
    supplierId: rawSupplierId,
  } = validatedFields.data;

  // Ensure supplierId is null if it's an empty string or nullish, otherwise use the ID
  const supplierId = rawSupplierId ? rawSupplierId : null;

  try {
    // First, check if the purchase exists and belongs to this user
    const existingPurchase = await db.purchase.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!existingPurchase) {
      return { error: "Pembelian tidak ditemukan!" };
    }

    // Get the original items to calculate stock adjustments
    const originalItems = existingPurchase.items;

    // 2. Update purchase in database with transaction to ensure all operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // First, delete all existing items
      await tx.purchaseItem.deleteMany({
        where: {
          purchaseId: id,
        },
      });

      // Update the purchase record
      const purchase = await tx.purchase.update({
        where: {
          id,
        },
        data: {
          totalAmount,
          invoiceRef,
          supplierId,
          items: {
            create: items.map((item) => ({
              quantity: item.quantity,
              costAtPurchase: item.costAtPurchase,
              productId: item.productId,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Adjust product stock: first subtract the original quantities, then add the new quantities
      // This handles both new items, removed items, and quantity changes

      // Subtract original quantities (reverse the original purchase)
      for (const item of originalItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Add new quantities (apply the updated purchase)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return purchase;
    });

    // 3. Revalidate the purchases page cache
    revalidatePath("/dashboard/purchases");
    revalidatePath(`/dashboard/purchases/${id}`);

    // Serialize the result to convert Decimal to number and Date to string
    const serializedResult = {
      id: result.id,
      purchaseDate: result.purchaseDate.toISOString(),
      totalAmount: result.totalAmount.toNumber(),
      invoiceRef: result.invoiceRef,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
      userId: result.userId,
      supplierId: result.supplierId,
      items: result.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        costAtPurchase: item.costAtPurchase.toNumber(),
        purchaseId: item.purchaseId,
        productId: item.productId,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    };

    return {
      success: "Pembelian berhasil diperbarui!",
      data: serializedResult,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal memperbarui pembelian. Silakan coba lagi." };
  }
};

export const deletePurchase = async (id: string) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    // First, check if the purchase exists and belongs to this user
    const existingPurchase = await db.purchase.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!existingPurchase) {
      return { error: "Pembelian tidak ditemukan!" };
    }

    // Get the original items to revert stock changes
    const originalItems = existingPurchase.items;

    // Use a transaction to ensure all operations succeed or fail together
    await db.$transaction(async (tx) => {
      // First, revert the stock changes by decrementing the stock for each item
      for (const item of originalItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Delete all purchase items
      await tx.purchaseItem.deleteMany({
        where: {
          purchaseId: id,
        },
      });

      // Delete the purchase
      await tx.purchase.delete({
        where: {
          id,
          userId, // Ensure the purchase belongs to the current user
        },
      });
    });

    // Revalidate the purchases page cache
    revalidatePath("/dashboard/purchases");

    return { success: "Pembelian berhasil dihapus!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal menghapus pembelian. Silakan coba lagi." };
  }
};
