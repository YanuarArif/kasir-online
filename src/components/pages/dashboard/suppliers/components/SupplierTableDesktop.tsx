import React from "react";
import Link from "next/link";
import { Supplier, ColumnVisibility } from "../types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Building2, Mail, Phone, MapPin, Calendar, FileText, User } from "lucide-react";

interface SupplierTableDesktopProps {
  suppliers: Supplier[];
  columnVisibility: ColumnVisibility;
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => React.ReactNode;
  searchTerm: string;
}

export const SupplierTableDesktop: React.FC<SupplierTableDesktopProps> = ({
  suppliers,
  columnVisibility,
  handleSort,
  getSortIcon,
  searchTerm,
}) => {
  // Format date for display
  const formatDate = (date: Date) => {
    return format(new Date(date), "dd MMMM yyyy", { locale: id });
  };

  return (
    <div className="relative overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            {columnVisibility.name && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  Nama Supplier
                  {getSortIcon("name")}
                </div>
              </th>
            )}
            {columnVisibility.contactName && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("contactName")}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  Nama Kontak
                  {getSortIcon("contactName")}
                </div>
              </th>
            )}
            {columnVisibility.email && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  Email
                  {getSortIcon("email")}
                </div>
              </th>
            )}
            {columnVisibility.phone && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("phone")}
              >
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  Telepon
                  {getSortIcon("phone")}
                </div>
              </th>
            )}
            {columnVisibility.address && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("address")}
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  Alamat
                  {getSortIcon("address")}
                </div>
              </th>
            )}
            {columnVisibility.createdAt && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Tanggal Dibuat
                  {getSortIcon("createdAt")}
                </div>
              </th>
            )}
            {columnVisibility.updatedAt && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Terakhir Diperbarui
                  {getSortIcon("updatedAt")}
                </div>
              </th>
            )}
            {columnVisibility.notes && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("notes")}
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  Catatan
                  {getSortIcon("notes")}
                </div>
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-right">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {columnVisibility.name && (
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200">
                        <Building2 className="h-3 w-3 mr-1" />
                      </Badge>
                      {supplier.name}
                    </div>
                  </td>
                )}
                {columnVisibility.contactName && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {supplier.contactName || "-"}
                  </td>
                )}
                {columnVisibility.email && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {supplier.email ? (
                      <a 
                        href={`mailto:${supplier.email}`} 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {supplier.email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
                {columnVisibility.phone && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {supplier.phone ? (
                      <a 
                        href={`tel:${supplier.phone}`} 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {supplier.phone}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
                {columnVisibility.address && (
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {supplier.address || "-"}
                  </td>
                )}
                {columnVisibility.createdAt && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {formatDate(supplier.createdAt)}
                  </td>
                )}
                {columnVisibility.updatedAt && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {formatDate(supplier.updatedAt)}
                  </td>
                )}
                {columnVisibility.notes && (
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {supplier.notes || "-"}
                  </td>
                )}
                <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                  <Link
                    href={`/dashboard/suppliers/${supplier.id}`}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  Object.values(columnVisibility).filter(Boolean).length + 1
                }
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                {searchTerm
                  ? "Tidak ada supplier yang sesuai dengan pencarian."
                  : "Belum ada data supplier."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
