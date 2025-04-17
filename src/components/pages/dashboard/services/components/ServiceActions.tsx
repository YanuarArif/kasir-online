import React from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnVisibility } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ServiceActionsProps {
  columnVisibility: ColumnVisibility;
  setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onFilterClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
}

export const ServiceActions: React.FC<ServiceActionsProps> = ({
  columnVisibility,
  setColumnVisibility,
  searchTerm,
  setSearchTerm,
  onFilterClick,
  onImportClick,
  onExportClick,
}) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      {/* Search */}
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="search"
          placeholder="Cari servis..."
          className="w-full bg-white pl-8 dark:bg-gray-950"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 cursor-pointer"
          onClick={onFilterClick}
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filter</span>
        </Button>

        {/* Import Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 cursor-pointer"
          onClick={onImportClick}
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Import</span>
        </Button>

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 cursor-pointer"
          onClick={onExportClick}
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kolom</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={columnVisibility.serviceNumber}
              className="cursor-pointer"
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  serviceNumber: checked,
                }))
              }
            >
              No. Servis
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.customerName}
              className="cursor-pointer"
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  customerName: checked,
                }))
              }
            >
              Nama Pelanggan
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.deviceType}
              className="cursor-pointer"
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  deviceType: checked,
                }))
              }
            >
              Tipe Perangkat
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.deviceBrand}
              className="cursor-pointer"
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  deviceBrand: checked,
                }))
              }
            >
              Merek
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.deviceModel}
              className="cursor-pointer"
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  deviceModel: checked,
                }))
              }
            >
              Model
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.status}
              className="cursor-pointer"
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  status: checked,
                }))
              }
            >
              Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.receivedDate}
              className="cursor-pointer"
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  receivedDate: checked,
                }))
              }
            >
              Tanggal Masuk
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.estimatedCompletionDate}
              className="cursor-pointer"
              onCheckedChange={(checked) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  estimatedCompletionDate: checked,
                }))
              }
            >
              Estimasi Selesai
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add New Service Button */}
        <Link href="/dashboard/services/management/new" passHref>
          <Button size="sm" className="h-8 gap-1 cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Servis</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
