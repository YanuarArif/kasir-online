import React from "react";
import Link from "next/link";
import { Sale, ColumnVisibility } from "../types"; // Import from the types file

interface SaleTableDesktopProps {
  sales: Sale[];
  columnVisibility: ColumnVisibility;
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => React.ReactNode;
  searchTerm: string;
}

export const SaleTableDesktop: React.FC<SaleTableDesktopProps> = ({
  sales,
  columnVisibility,
  handleSort,
  getSortIcon,
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
    <div className="relative overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg hidden md:block">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            {columnVisibility.id && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  ID Transaksi
                  {getSortIcon("id")}
                </div>
              </th>
            )}
            {columnVisibility.date && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("saleDate")}
              >
                <div className="flex items-center">
                  Tanggal
                  {getSortIcon("saleDate")}
                </div>
              </th>
            )}
            {columnVisibility.itemCount && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("itemCount")}
              >
                <div className="flex items-center">
                  Jumlah Item
                  {getSortIcon("itemCount")}
                </div>
              </th>
            )}
            {columnVisibility.totalAmount && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("totalAmount")}
              >
                <div className="flex items-center">
                  Total
                  {getSortIcon("totalAmount")}
                </div>
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-right">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <tr
                key={sale.id}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {columnVisibility.id && (
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {sale.id.substring(0, 4)}-{sale.id.substring(4, 8)}-
                    {sale.id.substring(8, 12)}
                  </td>
                )}
                {columnVisibility.date && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {formatDate(sale.saleDate)}
                  </td>
                )}
                {columnVisibility.itemCount && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {sale.items.length} item
                  </td>
                )}
                {columnVisibility.totalAmount && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    Rp {sale.totalAmount.toLocaleString("id-ID")}
                  </td>
                )}
                <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                  <Link
                    href={`/dashboard/sales/${sale.id}`}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  Object.values(columnVisibility).filter(Boolean).length + 1
                }
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
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
  );
};
