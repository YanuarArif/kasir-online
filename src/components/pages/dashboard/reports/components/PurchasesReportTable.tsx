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
import { getPurchaseReportData } from "@/actions/reports";

interface PurchasesReportTableProps {
  dateRange: string;
}

interface PurchaseData {
  id: string;
  date: string;
  supplier: string;
  items: number;
  total: number;
  invoiceRef: string;
}

export const PurchasesReportTable: React.FC<PurchasesReportTableProps> = ({
  dateRange,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [sortField, setSortField] = useState<keyof PurchaseData>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch purchases data based on date range
  useEffect(() => {
    const fetchPurchaseData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getPurchaseReportData(dateRange);

        if (result.error) {
          setError(result.error);
        } else if (result.success && result.data) {
          setPurchases(result.data);
        } else {
          setError("Gagal mengambil data pembelian");
        }
      } catch (err) {
        console.error("Error fetching purchase data:", err);
        setError("Gagal memuat data pembelian");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseData();
  }, [dateRange]);

  // Handle sorting
  const handleSort = (field: keyof PurchaseData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort the data
  const sortedPurchases = [...purchases].sort((a, b) => {
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
  const getSortIcon = (field: keyof PurchaseData) => {
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
    <div id="purchases-report-table" className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("id")}
            >
              ID Pembelian {getSortIcon("id")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("date")}
            >
              Tanggal {getSortIcon("date")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("supplier")}
            >
              Supplier {getSortIcon("supplier")}
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
              onClick={() => handleSort("invoiceRef")}
            >
              Referensi Invoice {getSortIcon("invoiceRef")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPurchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Tidak ada data pembelian untuk periode ini
              </TableCell>
            </TableRow>
          ) : (
            sortedPurchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.id}</TableCell>
                <TableCell>{formatDate(purchase.date)}</TableCell>
                <TableCell>{purchase.supplier}</TableCell>
                <TableCell>{purchase.items}</TableCell>
                <TableCell>{formatCurrency(purchase.total)}</TableCell>
                <TableCell>{purchase.invoiceRef}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
