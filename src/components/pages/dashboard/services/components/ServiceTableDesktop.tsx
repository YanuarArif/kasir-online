import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { Service, ColumnVisibility, ServiceStatus } from "../types";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface ServiceTableDesktopProps {
  services: Service[];
  columnVisibility: ColumnVisibility;
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => React.ReactNode;
  getStatusBadge: (status: ServiceStatus) => React.ReactNode;
  searchTerm: string;
}

export const ServiceTableDesktop: React.FC<ServiceTableDesktopProps> = ({
  services,
  columnVisibility,
  handleSort,
  getSortIcon,
  getStatusBadge,
  searchTerm,
}) => {
  if (services.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">Tidak ada data servis</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {searchTerm
            ? `Tidak ada hasil untuk pencarian "${searchTerm}"`
            : "Belum ada data servis yang tersedia. Tambahkan servis baru untuk memulai."}
        </p>
      </div>
    );
  }

  return (
    <Table className="border-b dark:border-gray-700">
      <TableHeader className="bg-gray-100 dark:bg-gray-800">
        <TableRow>
          {/* Service Number */}
          {columnVisibility.serviceNumber && (
            <TableHead
              className="w-[120px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleSort("serviceNumber")}
            >
              <div className="flex items-center">
                No. Servis {getSortIcon("serviceNumber")}
              </div>
            </TableHead>
          )}

          {/* Customer Name */}
          {columnVisibility.customerName && (
            <TableHead
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleSort("customerName")}
            >
              <div className="flex items-center">
                Pelanggan {getSortIcon("customerName")}
              </div>
            </TableHead>
          )}

          {/* Device Type */}
          {columnVisibility.deviceType && (
            <TableHead
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleSort("deviceType")}
            >
              <div className="flex items-center">
                Tipe {getSortIcon("deviceType")}
              </div>
            </TableHead>
          )}

          {/* Device Brand */}
          {columnVisibility.deviceBrand && (
            <TableHead
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleSort("deviceBrand")}
            >
              <div className="flex items-center">
                Merek {getSortIcon("deviceBrand")}
              </div>
            </TableHead>
          )}

          {/* Device Model */}
          {columnVisibility.deviceModel && (
            <TableHead
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleSort("deviceModel")}
            >
              <div className="flex items-center">
                Model {getSortIcon("deviceModel")}
              </div>
            </TableHead>
          )}

          {/* Status */}
          {columnVisibility.status && (
            <TableHead
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                Status {getSortIcon("status")}
              </div>
            </TableHead>
          )}

          {/* Received Date */}
          {columnVisibility.receivedDate && (
            <TableHead
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleSort("receivedDate")}
            >
              <div className="flex items-center">
                Tanggal Masuk {getSortIcon("receivedDate")}
              </div>
            </TableHead>
          )}

          {/* Estimated Completion Date */}
          {columnVisibility.estimatedCompletionDate && (
            <TableHead
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleSort("estimatedCompletionDate")}
            >
              <div className="flex items-center">
                Estimasi Selesai {getSortIcon("estimatedCompletionDate")}
              </div>
            </TableHead>
          )}

          {/* Actions */}
          <TableHead className="w-[100px] text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            {/* Service Number */}
            {columnVisibility.serviceNumber && (
              <TableCell className="font-medium">
                {service.serviceNumber}
              </TableCell>
            )}

            {/* Customer Name */}
            {columnVisibility.customerName && (
              <TableCell>{service.customerName}</TableCell>
            )}

            {/* Device Type */}
            {columnVisibility.deviceType && (
              <TableCell>{service.deviceType}</TableCell>
            )}

            {/* Device Brand */}
            {columnVisibility.deviceBrand && (
              <TableCell>{service.deviceBrand}</TableCell>
            )}

            {/* Device Model */}
            {columnVisibility.deviceModel && (
              <TableCell>{service.deviceModel}</TableCell>
            )}

            {/* Status */}
            {columnVisibility.status && (
              <TableCell>{getStatusBadge(service.status)}</TableCell>
            )}

            {/* Received Date */}
            {columnVisibility.receivedDate && (
              <TableCell>
                {service.receivedDate ? formatDate(service.receivedDate) : "-"}
              </TableCell>
            )}

            {/* Estimated Completion Date */}
            {columnVisibility.estimatedCompletionDate && (
              <TableCell>
                {service.estimatedCompletionDate
                  ? formatDate(service.estimatedCompletionDate)
                  : "-"}
              </TableCell>
            )}

            {/* Actions */}
            <TableCell className="text-right">
              <div className="flex justify-end space-x-1">
                <Link
                  href={`/dashboard/services/management/${service.id}`}
                  passHref
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/services/management/${service.id}/edit`}
                  passHref
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
