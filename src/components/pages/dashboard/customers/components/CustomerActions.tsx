import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Download,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import { ColumnVisibility } from "../types";

interface CustomerActionsProps {
  columnVisibility: ColumnVisibility;
  setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onFilterClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
}

export const CustomerActions: React.FC<CustomerActionsProps> = ({
  columnVisibility,
  setColumnVisibility,
  searchTerm,
  setSearchTerm,
  onFilterClick,
  onImportClick,
  onExportClick,
}) => {
  // Toggle column visibility
  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="search"
          placeholder="Cari pelanggan..."
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-9"
          onClick={onFilterClick}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Kolom
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => toggleColumn("name")}
                disabled={columnVisibility.name}
              >
                {columnVisibility.name ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                Nama Pelanggan
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleColumn("contactName")}
              >
                {columnVisibility.contactName ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                Nama Kontak
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleColumn("email")}
              >
                {columnVisibility.email ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                Email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleColumn("phone")}
              >
                {columnVisibility.phone ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                Telepon
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleColumn("address")}
              >
                {columnVisibility.address ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                Alamat
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleColumn("createdAt")}
              >
                {columnVisibility.createdAt ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                Tanggal Dibuat
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleColumn("updatedAt")}
              >
                {columnVisibility.updatedAt ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                Tanggal Diperbarui
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleColumn("notes")}
              >
                {columnVisibility.notes ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                Catatan
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Import/Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Import/Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onImportClick}>
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportClick}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Customer Button */}
        <Button size="sm" className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          <Link href="/dashboard/customers/new">Tambah Pelanggan</Link>
        </Button>
      </div>
    </div>
  );
};
