import React from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

interface StockCounts {
  available: number;
  low: number;
  outOfStock: number;
  needsApproval: number; // Keep for potential future use if needed by parent
}

interface StockSummaryCardsProps {
  stockCounts: StockCounts;
}

export const StockSummaryCards: React.FC<StockSummaryCardsProps> = ({
  stockCounts,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Stok tersedia */}
      <div className="rounded-lg border border-gray-200 bg-green-50 dark:border-gray-700 dark:bg-green-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Stok tersedia
          </div>
          <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total produk
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stockCounts.available}
          </div>
        </div>
      </div>

      {/* Stok segera habis */}
      <div className="rounded-lg border border-gray-200 bg-amber-50 dark:border-gray-700 dark:bg-amber-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Stok segera habis
          </div>
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total produk
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stockCounts.low}
          </div>
        </div>
      </div>

      {/* Stok habis */}
      <div className="rounded-lg border border-gray-200 bg-red-50 dark:border-gray-700 dark:bg-red-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Stok habis
          </div>
          <XCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total produk
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stockCounts.outOfStock}
          </div>
        </div>
      </div>

      {/* Gudang */}
      <div className="rounded-lg border border-gray-200 bg-blue-50 dark:border-gray-700 dark:bg-blue-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Gudang
          </div>
          <BuildingStorefrontIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Terdaftar
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            0
          </div>
        </div>
      </div>
    </div>
  );
};
