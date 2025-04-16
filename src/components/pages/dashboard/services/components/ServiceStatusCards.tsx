import React from "react";
import { Clock, Wrench, Truck, CheckCircle } from "lucide-react";
import { ServiceCounts } from "../types";

interface ServiceStatusCardsProps {
  serviceCounts: ServiceCounts;
}

export const ServiceStatusCards: React.FC<ServiceStatusCardsProps> = ({
  serviceCounts,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Servis Masuk */}
      <div className="rounded-lg border border-gray-200 bg-blue-50 dark:border-gray-700 dark:bg-blue-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Servis Masuk
          </div>
          <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total servis
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {serviceCounts.pending}
          </div>
        </div>
      </div>

      {/* Servis Diproses */}
      <div className="rounded-lg border border-gray-200 bg-amber-50 dark:border-gray-700 dark:bg-amber-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Servis Diproses
          </div>
          <Wrench className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total servis
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {serviceCounts.inProgress}
          </div>
        </div>
      </div>

      {/* Servis Menunggu Sparepart */}
      <div className="rounded-lg border border-gray-200 bg-purple-50 dark:border-gray-700 dark:bg-purple-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Menunggu Sparepart
          </div>
          <Truck className="h-5 w-5 text-purple-500 dark:text-purple-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total servis
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {serviceCounts.waitingForParts}
          </div>
        </div>
      </div>

      {/* Servis Selesai */}
      <div className="rounded-lg border border-gray-200 bg-green-50 dark:border-gray-700 dark:bg-green-900/20">
        <div className="flex justify-between items-center p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Servis Selesai
          </div>
          <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total servis
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {serviceCounts.completed}
          </div>
        </div>
      </div>
    </div>
  );
};
