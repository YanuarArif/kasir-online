import React from "react";
import Link from "next/link";
import { Purchase } from "../types"; // Import from the types file

interface PurchaseListMobileProps {
  purchases: Purchase[];
  searchTerm: string;
}

export const PurchaseListMobile: React.FC<PurchaseListMobileProps> = ({
  purchases,
  searchTerm,
}) => {
  // Format date for display
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
      {purchases.length > 0 ? (
        purchases.map((purchase) => (
          <div key={purchase.id} className="p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                ID:
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-right break-words">
                {purchase.id.substring(0, 8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Tanggal:
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {formatDate(purchase.purchaseDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Supplier:
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-right break-words">
                {purchase.supplier?.name || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Total:
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Rp {purchase.totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                No. Faktur:
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {purchase.invoiceRef || "-"}
              </span>
            </div>
            <div className="text-right pt-2">
              <Link
                href={`/dashboard/purchases/${purchase.id}`}
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
            ? "Tidak ada pembelian yang sesuai dengan pencarian."
            : "Belum ada data pembelian."}
        </div>
      )}
    </div>
  );
};
