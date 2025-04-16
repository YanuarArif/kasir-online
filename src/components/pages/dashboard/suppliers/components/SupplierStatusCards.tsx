import React from "react";
import { SupplierStatus } from "../types";
import { Building2, CheckCircle2, XCircle } from "lucide-react";

interface SupplierStatusCardsProps {
  supplierStatus: SupplierStatus;
}

export const SupplierStatusCards: React.FC<SupplierStatusCardsProps> = ({
  supplierStatus,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Total Suppliers */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Supplier
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {supplierStatus.total}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-gray-500 dark:text-gray-400">
              Semua supplier yang terdaftar
            </span>
          </div>
        </div>
      </div>

      {/* Active Suppliers */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-green-500" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Supplier Aktif
                </dt>
                <dd>
                  <div className="text-lg font-medium text-green-600 dark:text-green-400">
                    {supplierStatus.active}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-green-700 dark:text-green-400">
              {Math.round((supplierStatus.active / supplierStatus.total) * 100) || 0}% dari total supplier
            </span>
          </div>
        </div>
      </div>

      {/* Inactive Suppliers */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Supplier Tidak Aktif
                </dt>
                <dd>
                  <div className="text-lg font-medium text-red-600 dark:text-red-400">
                    {supplierStatus.inactive}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-red-700 dark:text-red-400">
              {Math.round((supplierStatus.inactive / supplierStatus.total) * 100) || 0}% dari total supplier
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
