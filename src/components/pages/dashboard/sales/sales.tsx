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

  // Filter sales based on search term
  const filteredSales = sales.filter((sale) =>
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions (Filter, Search, Add) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative flex-grow w-full sm:w-auto">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            placeholder="Cari Transaksi (ID)"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
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

      {/* Sales Table/List */}
      <div className="overflow-x-auto">
        {/* Desktop Table View - shadcn style */}
        <div className="relative overflow-x-auto border border-gray-200 rounded-lg hidden md:block">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID Transaksi
                </th>
                <th scope="col" className="px-6 py-3">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3">
                  Jumlah Item
                </th>
                <th scope="col" className="px-6 py-3">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {sale.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(sale.saleDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.items.length} item
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Rp {sale.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link href={`/dashboard/sales/${sale.id}`} legacyBehavior>
                        <a className="text-indigo-600 hover:text-indigo-900 font-medium">
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
                    className="px-6 py-4 text-center text-gray-500"
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

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200 bg-white">
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <div key={sale.id} className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    ID Transaksi:
                  </span>
                  <span className="text-gray-500">{sale.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Tanggal:</span>
                  <span className="text-gray-500">
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
                  <span className="text-gray-500">
                    {sale.items.length} item
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Total:</span>
                  <span className="text-gray-500">
                    Rp {sale.totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="text-right">
                  <Link href={`/dashboard/sales/${sale.id}`} legacyBehavior>
                    <a className="text-indigo-600 hover:text-indigo-900">
                      Detail
                    </a>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              {searchTerm
                ? "Tidak ada transaksi yang sesuai dengan pencarian."
                : "Belum ada data penjualan."}
            </div>
          )}
        </div>
      </div>
      {/* Add Pagination here if needed */}
    </div>
  );
};

export default SalesPage;
