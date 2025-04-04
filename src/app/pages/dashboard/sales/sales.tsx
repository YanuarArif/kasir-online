"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

// Define the type for the sales prop
interface SaleItem {
  id: string;
  quantity: number;
  priceAtSale: number;
  saleId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  product: {
    name: string;
  };
}

interface Sale {
  id: string;
  saleDate: Date;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  items: SaleItem[];
}

interface SalesPageProps {
  sales: Sale[];
}

const SalesPage: React.FC<SalesPageProps> = ({ sales }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredSales = sales.filter((sale) =>
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            placeholder="Cari Transaksi (ID)"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto"
          >
            <FunnelIcon className="mr-2 h-5 w-5 text-gray-400" />
            Filter
          </button>
          <Link href="/dashboard/sales/new" legacyBehavior>
            <a className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto">
              <PlusIcon className="mr-2 h-5 w-5" />
              Tambah Penjualan
            </a>
          </Link>
        </div>
      </div>

      {/* Sales List */}
      <div className="space-y-4 sm:shadow sm:ring-1 sm:ring-black sm:ring-opacity-5 sm:rounded-lg">
        {/* Table for larger screens */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  ID Transaksi
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Jumlah Item
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {sale.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(sale.saleDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {sale.items.length} item
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      Rp {sale.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link href={`/dashboard/sales/${sale.id}`} legacyBehavior>
                        <a className="text-indigo-600 hover:text-indigo-900">
                          Detail
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500"
                  >
                    {searchTerm
                      ? "Tidak ada transaksi yang sesuai dengan pencarian."
                      : "Belum ada data penjualan."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card layout for mobile */}
        <div className="sm:hidden space-y-4">
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <div key={sale.id} className="bg-white p-4 rounded-lg shadow">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">ID:</span>
                    <span className="text-gray-700">{sale.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Tanggal:</span>
                    <span className="text-gray-700">
                      {new Date(sale.saleDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      Jumlah Item:
                    </span>
                    <span className="text-gray-700">
                      {sale.items.length} item
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="text-gray-700">
                      Rp {sale.totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="text-right">
                    <Link href={`/dashboard/sales/${sale.id}`} legacyBehavior>
                      <a className="text-indigo-600 hover:text-indigo-900 text-sm">
                        Detail
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
              {searchTerm
                ? "Tidak ada transaksi yang sesuai dengan pencarian."
                : "Belum ada data penjualan."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
