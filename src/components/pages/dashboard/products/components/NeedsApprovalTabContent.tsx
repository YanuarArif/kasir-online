import React from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

export const NeedsApprovalTabContent: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <ClockIcon className="h-12 w-12 mx-auto text-amber-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Produk Perlu Persetujuan
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        Tidak ada produk yang memerlukan persetujuan saat ini.
      </p>
    </div>
  );
};
