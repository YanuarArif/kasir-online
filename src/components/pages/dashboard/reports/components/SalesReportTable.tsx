"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface SalesReportTableProps {
  dateRange: string;
}

interface SaleData {
  id: string;
  date: string;
  customer: string;
  items: number;
  total: number;
  paymentMethod: string;
}

export const SalesReportTable: React.FC<SalesReportTableProps> = ({
  dateRange,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sales, setSales] = useState<SaleData[]>([]);
  const [sortField, setSortField] = useState<keyof SaleData>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch sales data based on date range
  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        // Mock data - in a real app, this would be fetched from an API
        const mockSales: SaleData[] = [
          {
            id: "INV-001",
            date: "2025-04-14",
            customer: "John Doe",
            items: 5,
            total: 250000,
            paymentMethod: "Cash",
          },
          {
            id: "INV-002",
            date: "2025-04-13",
            customer: "Jane Smith",
            items: 3,
            total: 175000,
            paymentMethod: "Credit Card",
          },
          {
            id: "INV-003",
            date: "2025-04-12",
            customer: "Bob Johnson",
            items: 7,
            total: 350000,
            paymentMethod: "Debit Card",
          },
          {
            id: "INV-004",
            date: "2025-04-11",
            customer: "Alice Brown",
            items: 2,
            total: 125000,
            paymentMethod: "Cash",
          },
          {
            id: "INV-005",
            date: "2025-04-10",
            customer: "Charlie Wilson",
            items: 4,
            total: 200000,
            paymentMethod: "Credit Card",
          },
        ];

        setSales(mockSales);
        setLoading(false);
      } catch (err) {
        setError("Failed to load sales data");
        setLoading(false);
      }
    }, 1000);
  }, [dateRange]);

  // Handle sorting
  const handleSort = (field: keyof SaleData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort the data
  const sortedSales = [...sales].sort((a, b) => {
    if (sortField === "total" || sortField === "items") {
      return sortDirection === "asc"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else {
      const aValue = String(a[sortField]).toLowerCase();
      const bValue = String(b[sortField]).toLowerCase();
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get sort icon
  const getSortIcon = (field: keyof SaleData) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div id="sales-report-table" className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("id")}
            >
              ID Transaksi {getSortIcon("id")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("date")}
            >
              Tanggal {getSortIcon("date")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("customer")}
            >
              Pelanggan {getSortIcon("customer")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("items")}
            >
              Jumlah Item {getSortIcon("items")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("total")}
            >
              Total {getSortIcon("total")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("paymentMethod")}
            >
              Metode Pembayaran {getSortIcon("paymentMethod")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Tidak ada data penjualan untuk periode ini
              </TableCell>
            </TableRow>
          ) : (
            sortedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{formatDate(sale.date)}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>{sale.items}</TableCell>
                <TableCell>{formatCurrency(sale.total)}</TableCell>
                <TableCell>{sale.paymentMethod}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
