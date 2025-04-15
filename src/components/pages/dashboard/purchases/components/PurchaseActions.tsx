import React from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnVisibility {
  id: boolean;
  date: boolean;
  supplier: boolean;
  totalAmount: boolean;
  invoiceRef: boolean;
  itemCount: boolean;
}

interface PurchaseActionsProps {
  columnVisibility: ColumnVisibility;
  setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onFilterClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
}

export const PurchaseActions: React.FC<PurchaseActionsProps> = ({
  columnVisibility,
  setColumnVisibility,
  searchTerm,
  setSearchTerm,
  onFilterClick,
  onImportClick,
  onExportClick,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <AdjustmentsHorizontalIcon className="mr-2 h-5 w-5" />
            Kolom
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={columnVisibility.id}
              onCheckedChange={(checked) =>
                setColumnVisibility({ ...columnVisibility, id: checked })
              }
            >
              ID Pembelian
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.date}
              onCheckedChange={(checked) =>
                setColumnVisibility({ ...columnVisibility, date: checked })
              }
            >
              Tanggal
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.supplier}
              onCheckedChange={(checked) =>
                setColumnVisibility({ ...columnVisibility, supplier: checked })
              }
            >
              Supplier
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.totalAmount}
              onCheckedChange={(checked) =>
                setColumnVisibility({
                  ...columnVisibility,
                  totalAmount: checked,
                })
              }
            >
              Total
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.invoiceRef}
              onCheckedChange={(checked) =>
                setColumnVisibility({
                  ...columnVisibility,
                  invoiceRef: checked,
                })
              }
            >
              No. Faktur
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.itemCount}
              onCheckedChange={(checked) =>
                setColumnVisibility({
                  ...columnVisibility,
                  itemCount: checked,
                })
              }
            >
              Jumlah Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <FunnelIcon className="mr-2 h-5 w-5" />
          Filter
        </button>

        {/* Import Button */}
        <button
          type="button"
          onClick={onImportClick}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          Import
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExportClick}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
          Export
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            placeholder="Cari pembelian..."
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Purchase Button */}
        <Link
          href="/dashboard/purchases/new"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Tambah
        </Link>
      </div>
    </div>
  );
};
