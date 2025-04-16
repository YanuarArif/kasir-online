import { db } from "../lib/prisma";
import { NotificationType } from "@prisma/client";

/**
 * This script seeds the database with initial notifications for testing.
 * Run it with: npx ts-node -r tsconfig-paths/register src/scripts/seed-notifications.ts
 */
async function main() {
  try {
    // Get all users
    const users = await db.user.findMany();

    if (users.length === 0) {
      console.log("No users found. Please create users first.");
      return;
    }

    // For each user, create some notifications
    for (const user of users) {
      console.log(
        `Creating notifications for user: ${user.name || user.email || user.id}`
      );

      // Create warning notification
      await db.notification.create({
        data: {
          userId: user.id,
          type: NotificationType.WARNING,
          title: "Stok Menipis",
          message:
            "Beberapa produk hampir habis stoknya. Segera lakukan pembelian.",
          isRead: false,
        },
      });

      // Create success notification
      await db.notification.create({
        data: {
          userId: user.id,
          type: NotificationType.SUCCESS,
          title: "Penjualan Berhasil",
          message: "Penjualan baru telah berhasil dicatat.",
          isRead: true,
        },
      });

      // Create info notification
      await db.notification.create({
        data: {
          userId: user.id,
          type: NotificationType.INFO,
          title: "Pembaruan Sistem",
          message: "Sistem akan diperbarui pada tanggal 15 bulan ini.",
          isRead: false,
        },
      });

      // Create error notification
      await db.notification.create({
        data: {
          userId: user.id,
          type: NotificationType.ERROR,
          title: "Gagal Sinkronisasi",
          message: "Terjadi kesalahan saat menyinkronkan data.",
          isRead: true,
        },
      });

      // Create another info notification
      await db.notification.create({
        data: {
          userId: user.id,
          type: NotificationType.INFO,
          title: "Karyawan Baru",
          message: "Karyawan baru telah ditambahkan ke sistem.",
          isRead: false,
        },
      });
    }

    console.log("Notifications seeded successfully!");
  } catch (error) {
    console.error("Error seeding notifications:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
