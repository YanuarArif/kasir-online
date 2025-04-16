import React from "react";
import {
  ShoppingBagIcon,
  CalendarIcon,
  ArchiveBoxIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface PurchaseCounts {
  total: number;
  thisMonth: number;
  lastMonth: number;
  pending: number;
}

interface PurchaseSummaryCardsProps {
  purchaseCounts: PurchaseCounts;
}

export const PurchaseSummaryCards: React.FC<PurchaseSummaryCardsProps> = ({
  purchaseCounts,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Pembelian */}
      <div className="rounded-lg border border-gray-200 bg-green-50 dark:border-gray-700 dark:bg-green-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Pembelian
          </div>
          <ShoppingBagIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Transaksi
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {purchaseCounts.total}
          </div>
        </div>
      </div>

      {/* Pembelian Bulan Ini */}
      <div className="rounded-lg border border-gray-200 bg-amber-50 dark:border-gray-700 dark:bg-amber-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pembelian Bulan Ini
          </div>
          <CalendarIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Transaksi
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {purchaseCounts.thisMonth}
          </div>
        </div>
      </div>

      {/* Pembelian Bulan Lalu */}
      <div className="rounded-lg border border-gray-200 bg-blue-50 dark:border-gray-700 dark:bg-blue-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pembelian Bulan Lalu
          </div>
          <ArchiveBoxIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Transaksi
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {purchaseCounts.lastMonth}
          </div>
        </div>
      </div>

      {/* Pembelian Tertunda */}
      <div className="rounded-lg border border-gray-200 bg-red-50 dark:border-gray-700 dark:bg-red-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pembelian Tertunda
          </div>
          <ClockIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Transaksi
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {purchaseCounts.pending}
          </div>
        </div>
      </div>
    </div>
  );
};
