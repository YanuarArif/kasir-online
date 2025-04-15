import React from "react";
import Link from "next/link";
import { Sale } from "../types"; // Import from the types file

interface SaleListMobileProps {
  sales: Sale[];
  searchTerm: string;
}

export const SaleListMobile: React.FC<SaleListMobileProps> = ({
  sales,
  searchTerm,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {sales.length > 0 ? (
        sales.map((sale) => (
          <div key={sale.id} className="p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                ID Transaksi:
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-right break-words">
                {sale.id.substring(0, 4)}-{sale.id.substring(4, 8)}-
                {sale.id.substring(8, 12)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Tanggal:
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {formatDate(sale.saleDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Jumlah Item:
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {sale.items.length} item
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Total:
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Rp {sale.totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="text-right pt-2">
              <Link
                href={`/dashboard/sales/${sale.id}`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
              >
                Detail
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {searchTerm
            ? "Tidak ada transaksi yang sesuai dengan pencarian."
            : "Belum ada data penjualan."}
        </div>
      )}
    </div>
  );
};
