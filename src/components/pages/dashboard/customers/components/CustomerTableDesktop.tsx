import React from "react";
import Link from "next/link";
import { Customer, ColumnVisibility } from "../types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerTableDesktopProps {
  customers: Customer[];
  columnVisibility: ColumnVisibility;
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => React.ReactNode;
  searchTerm: string;
}

export const CustomerTableDesktop: React.FC<CustomerTableDesktopProps> = ({
  customers,
  columnVisibility,
  handleSort,
  getSortIcon,
  searchTerm,
}) => {
  return (
    <div className="relative overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            {columnVisibility.name && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nama Pelanggan
                  {getSortIcon("name")}
                </div>
              </th>
            )}
            {columnVisibility.contactName && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("contactName")}
              >
                <div className="flex items-center">
                  Nama Kontak
                  {getSortIcon("contactName")}
                </div>
              </th>
            )}
            {columnVisibility.email && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Email
                  {getSortIcon("email")}
                </div>
              </th>
            )}
            {columnVisibility.phone && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("phone")}
              >
                <div className="flex items-center">
                  Telepon
                  {getSortIcon("phone")}
                </div>
              </th>
            )}
            {columnVisibility.address && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("address")}
              >
                <div className="flex items-center">
                  Alamat
                  {getSortIcon("address")}
                </div>
              </th>
            )}
            {columnVisibility.NIK && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("NIK")}
              >
                <div className="flex items-center">
                  NIK
                  {getSortIcon("NIK")}
                </div>
              </th>
            )}
            {columnVisibility.NPWP && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("NPWP")}
              >
                <div className="flex items-center">
                  NPWP
                  {getSortIcon("NPWP")}
                </div>
              </th>
            )}
            {columnVisibility.createdAt && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Tanggal Dibuat
                  {getSortIcon("createdAt")}
                </div>
              </th>
            )}
            {columnVisibility.updatedAt && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center">
                  Tanggal Diperbarui
                  {getSortIcon("updatedAt")}
                </div>
              </th>
            )}
            {columnVisibility.notes && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("notes")}
              >
                <div className="flex items-center">
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
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr
                key={customer.id}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {columnVisibility.name && (
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200">
                        <User className="h-3 w-3 mr-1" />
                      </Badge>
                      {customer.name}
                    </div>
                  </td>
                )}
                {columnVisibility.contactName && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {customer.contactName || "-"}
                    </div>
                  </td>
                )}
                {columnVisibility.email && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {customer.email ? (
                        <>
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {customer.email}
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                )}
                {columnVisibility.phone && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {customer.phone ? (
                        <>
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {customer.phone}
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                )}
                {columnVisibility.address && (
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      {customer.address ? (
                        <>
                          <MapPin className="h-4 w-4 mr-1 text-gray-400 mt-0.5" />
                          <span className="line-clamp-2">
                            {customer.address}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                )}
                {columnVisibility.NIK && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {customer.NIK ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-1 text-gray-400" />
                          {customer.NIK}
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                )}
                {columnVisibility.NPWP && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {customer.NPWP ? (
                        <>
                          <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                          {customer.NPWP}
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                )}
                {columnVisibility.createdAt && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {format(customer.createdAt, "dd MMM yyyy", {
                        locale: id,
                      })}
                    </div>
                  </td>
                )}
                {columnVisibility.updatedAt && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {format(customer.updatedAt, "dd MMM yyyy", {
                        locale: id,
                      })}
                    </div>
                  </td>
                )}
                {columnVisibility.notes && (
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      {customer.notes ? (
                        <>
                          <FileText className="h-4 w-4 mr-1 text-gray-400 mt-0.5" />
                          <span className="line-clamp-2">{customer.notes}</span>
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-0"
                    asChild
                  >
                    <Link href={`/dashboard/customers/${customer.id}`}>
                      Detail
                    </Link>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
              <td
                colSpan={
                  Object.values(columnVisibility).filter(Boolean).length + 1
                }
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                {searchTerm
                  ? "Tidak ada pelanggan yang sesuai dengan pencarian."
                  : "Belum ada data pelanggan. Tambahkan pelanggan baru."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
