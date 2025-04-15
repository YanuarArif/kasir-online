import React from "react";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

export const WarehouseTabContent: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <BuildingStorefrontIcon className="h-12 w-12 mx-auto text-indigo-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Manajemen Penjualan Outlet
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        Fitur manajemen penjualan outlet akan segera hadir. Anda akan dapat mengelola penjualan
        di berbagai lokasi outlet.
      </p>
    </div>
  );
};
