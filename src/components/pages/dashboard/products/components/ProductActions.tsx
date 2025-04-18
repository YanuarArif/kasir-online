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
  name: boolean;
  sku: boolean;
  category: boolean;
  price: boolean;
  stock: boolean;
  stockStatus: boolean;
  cost: boolean;
  sellPrice: boolean;
  discountPrice: boolean;
}

interface ProductActionsProps {
  columnVisibility: ColumnVisibility;
  setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onFilterClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
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
            Kolom yang ditampilkan
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel>Pilih Kolom</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={columnVisibility.name}
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({ ...prev, name: !!checked }))
              }
              onSelect={(e) => e.preventDefault()}
            >
              Nama Produk
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.sku}
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({ ...prev, sku: !!checked }))
              }
              onSelect={(e) => e.preventDefault()}
            >
              Kode Produk
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.category}
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  category: !!checked,
                }))
              }
              onSelect={(e) => e.preventDefault()}
            >
              Kategori Produk
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.price}
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({ ...prev, price: !!checked }))
              }
              onSelect={(e) => e.preventDefault()}
            >
              Harga
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.stock}
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({ ...prev, stock: !!checked }))
              }
              onSelect={(e) => e.preventDefault()}
            >
              Total Stok
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.stockStatus}
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  stockStatus: !!checked,
                }))
              }
              onSelect={(e) => e.preventDefault()}
            >
              Status Stok
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.cost}
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({ ...prev, cost: !!checked }))
              }
              onSelect={(e) => e.preventDefault()}
            >
              Harga Beli
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.sellPrice}
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  sellPrice: !!checked,
                }))
              }
              onSelect={(e) => e.preventDefault()}
            >
              Harga Jual
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.discountPrice}
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  discountPrice: !!checked,
                }))
              }
              onSelect={(e) => e.preventDefault()}
            >
              Harga Diskon
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <FunnelIcon className="mr-2 h-5 w-5" />
          Filter
        </button>

        {/* Import Button */}
        <button
          onClick={onImportClick}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
          Import
        </button>

        {/* Export Button */}
        <button
          onClick={onExportClick}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          Export
        </button>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            placeholder="Cari Produk"
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Product Button */}
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Tambah
        </Link>
      </div>
    </div>
  );
};
