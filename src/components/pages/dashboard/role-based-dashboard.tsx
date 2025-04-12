"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShieldCheckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function RoleBasedDashboard() {
  const { data: session } = useSession();
  const userRole = session?.user?.role as Role | undefined;
  const isEmployee = session?.user?.isEmployee;

  // Get welcome message based on role
  const getWelcomeMessage = () => {
    if (!session?.user) return "Selamat Datang di Kasir Online";
    
    const name = session.user.name || "Pengguna";
    
    if (isEmployee) {
      return `Selamat Datang, ${name}! Anda login sebagai karyawan.`;
    }
    
    switch (userRole) {
      case Role.OWNER:
        return `Selamat Datang, ${name}! Anda memiliki akses penuh ke sistem.`;
      case Role.ADMIN:
        return `Selamat Datang, ${name}! Anda memiliki akses admin ke sistem.`;
      case Role.CASHIER:
        return `Selamat Datang, ${name}! Anda memiliki akses kasir ke sistem.`;
      default:
        return `Selamat Datang, ${name}!`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">{getWelcomeMessage()}</CardTitle>
          <CardDescription>
            Kelola bisnis Anda dengan mudah menggunakan Kasir Online
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Card - Available to all roles */}
        <Link href="/dashboard/sales" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Penjualan</CardTitle>
                <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Buat transaksi penjualan baru dan lihat riwayat penjualan
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                  Akses untuk semua peran
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Products Card - Available to all roles */}
        <Link href="/dashboard/products" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Produk</CardTitle>
                <CubeIcon className="h-6 w-6 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola produk, stok, dan kategori
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  Akses untuk semua peran
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Purchases Card - Only for OWNER and ADMIN */}
        {(userRole === Role.OWNER || userRole === Role.ADMIN) && (
          <Link href="/dashboard/purchases" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pembelian</CardTitle>
                  <ShoppingCartIcon className="h-6 w-6 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola pembelian dan restok produk
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/30 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
                    Akses untuk Pemilik & Admin
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Suppliers Card - Only for OWNER and ADMIN */}
        {(userRole === Role.OWNER || userRole === Role.ADMIN) && (
          <Link href="/dashboard/suppliers" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Supplier</CardTitle>
                  <BuildingStorefrontIcon className="h-6 w-6 text-indigo-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola daftar supplier dan kontak
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    Akses untuk Pemilik & Admin
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Customers Card - Available to all roles */}
        <Link href="/dashboard/customers" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pelanggan</CardTitle>
                <UserIcon className="h-6 w-6 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola data pelanggan dan riwayat transaksi
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-md bg-orange-50 dark:bg-orange-900/30 px-2 py-1 text-xs font-medium text-orange-700 dark:text-orange-300">
                  Akses untuk semua peran
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Reports Card - Only for OWNER and ADMIN */}
        {(userRole === Role.OWNER || userRole === Role.ADMIN) && (
          <Link href="/dashboard/reports" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Laporan</CardTitle>
                  <ChartBarIcon className="h-6 w-6 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lihat laporan penjualan, pembelian, dan keuangan
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-md bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    Akses untuk Pemilik & Admin
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Employees Card - Only for OWNER */}
        {userRole === Role.OWNER && (
          <Link href="/dashboard/settings/employees" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Karyawan</CardTitle>
                  <UserGroupIcon className="h-6 w-6 text-teal-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola karyawan dan akses mereka ke sistem
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-md bg-teal-50 dark:bg-teal-900/30 px-2 py-1 text-xs font-medium text-teal-700 dark:text-teal-300">
                    Akses khusus Pemilik
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Role Information Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-indigo-500" />
            <CardTitle>Informasi Peran</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userRole === Role.OWNER && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-medium text-purple-800 dark:text-purple-300 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Pemilik
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Anda memiliki akses penuh ke semua fitur sistem. Anda dapat mengelola karyawan, melihat laporan keuangan, dan mengakses pengaturan bisnis.
                </p>
              </div>
            )}

            {userRole === Role.ADMIN && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Admin
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Anda memiliki akses ke sebagian besar fitur sistem. Anda dapat mengelola produk, pembelian, dan melihat laporan, tetapi tidak dapat mengelola karyawan atau pengaturan bisnis.
                </p>
              </div>
            )}

            {userRole === Role.CASHIER && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-300 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Kasir
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Anda memiliki akses terbatas ke sistem. Anda dapat membuat transaksi penjualan, melihat produk, dan mengelola pelanggan, tetapi tidak dapat mengakses laporan keuangan atau pengaturan bisnis.
                </p>
              </div>
            )}

            {isEmployee && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-gray-300 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Status Karyawan
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Anda login sebagai karyawan. Akses Anda ke sistem dikelola oleh pemilik bisnis.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
