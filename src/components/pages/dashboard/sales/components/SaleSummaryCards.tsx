import React from "react";
import {
  ShoppingCartIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface SaleCounts {
  total: number;
  today: number;
  thisMonth: number;
  pending: number;
}

interface SaleSummaryCardsProps {
  saleCounts: SaleCounts;
}

export const SaleSummaryCards: React.FC<SaleSummaryCardsProps> = ({
  saleCounts,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Penjualan */}
      <div className="rounded-lg border border-gray-200 bg-green-50 dark:border-gray-700 dark:bg-green-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Penjualan
          </div>
          <ShoppingCartIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Transaksi
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {saleCounts.total}
          </div>
        </div>
      </div>

      {/* Penjualan Hari Ini */}
      <div className="rounded-lg border border-gray-200 bg-amber-50 dark:border-gray-700 dark:bg-amber-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Penjualan Hari Ini
          </div>
          <CalendarDaysIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Transaksi
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {saleCounts.today}
          </div>
        </div>
      </div>

      {/* Penjualan Bulan Ini */}
      <div className="rounded-lg border border-gray-200 bg-blue-50 dark:border-gray-700 dark:bg-blue-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Penjualan Bulan Ini
          </div>
          <CalendarIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Transaksi
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {saleCounts.thisMonth}
          </div>
        </div>
      </div>

      {/* Penjualan Tertunda */}
      <div className="rounded-lg border border-gray-200 bg-red-50 dark:border-gray-700 dark:bg-red-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Penjualan Tertunda
          </div>
          <ClockIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Transaksi
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {saleCounts.pending}
          </div>
        </div>
      </div>
    </div>
  );
};
