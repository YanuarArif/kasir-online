"use server";

import { createNotification } from "@/actions/notifications";
import { NotificationType as PrismaNotificationType } from "@prisma/client";
import { getEffectiveUserId } from "./get-effective-user-id";

/**
 * Creates a system notification for the current user
 */
export async function createSystemNotification(
  type: "info" | "warning" | "success" | "error",
  title: string,
  message: string
): Promise<boolean> {
  try {
    const userId = await getEffectiveUserId();

    if (!userId) {
      console.error("Failed to create notification: No authenticated user");
      return false;
    }

    const result = await createNotification({
      userId,
      type,
      title,
      message,
    });

    return result.success;
  } catch (error) {
    console.error("Error creating system notification:", error);
    return false;
  }
}

/**
 * Creates a low stock notification for the current user
 */
export async function createLowStockNotification(
  productName: string,
  currentStock: number
): Promise<boolean> {
  return createSystemNotification(
    "warning",
    "Stok Menipis",
    `Produk "${productName}" hampir habis stoknya (${currentStock} tersisa). Segera lakukan pembelian.`
  );
}

/**
 * Creates a sale success notification for the current user
 */
export async function createSaleSuccessNotification(
  saleId: string,
  totalAmount: number
): Promise<boolean> {
  return createSystemNotification(
    "success",
    "Penjualan Berhasil",
    `Penjualan #${saleId} sebesar Rp ${totalAmount.toLocaleString("id-ID")} telah berhasil dicatat.`
  );
}

/**
 * Creates a purchase success notification for the current user
 */
export async function createPurchaseSuccessNotification(
  purchaseId: string,
  totalAmount: number
): Promise<boolean> {
  return createSystemNotification(
    "success",
    "Pembelian Berhasil",
    `Pembelian #${purchaseId} sebesar Rp ${totalAmount.toLocaleString("id-ID")} telah berhasil dicatat.`
  );
}

/**
 * Creates a system update notification for the current user
 */
export async function createSystemUpdateNotification(
  updateDate: Date
): Promise<boolean> {
  const formattedDate = updateDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return createSystemNotification(
    "info",
    "Pembaruan Sistem",
    `Sistem akan diperbarui pada tanggal ${formattedDate}. Mohon simpan pekerjaan Anda sebelum waktu tersebut.`
  );
}

/**
 * Creates a new supplier notification for the current user
 */
export async function createSupplierAddedNotification(
  supplierName: string,
  supplierContact?: string
): Promise<boolean> {
  let message = `Supplier baru "${supplierName}" telah berhasil ditambahkan.`;

  if (supplierContact) {
    message += ` Kontak: ${supplierContact}.`;
  }

  return createSystemNotification(
    "success",
    "Supplier Baru Ditambahkan",
    message
  );
}

/**
 * Creates a new customer notification for the current user
 */
export async function createCustomerAddedNotification(
  customerName: string,
  customerContact?: string
): Promise<boolean> {
  let message = `Pelanggan baru "${customerName}" telah berhasil ditambahkan.`;

  if (customerContact) {
    message += ` Kontak: ${customerContact}.`;
  }

  return createSystemNotification(
    "success",
    "Pelanggan Baru Ditambahkan",
    message
  );
}
