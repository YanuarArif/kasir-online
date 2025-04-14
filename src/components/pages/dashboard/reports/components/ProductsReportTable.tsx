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
import { Badge } from "@/components/ui/badge";

interface ProductsReportTableProps {
  dateRange: string;
}

interface ProductData {
  id: string;
  name: string;
  category: string;
  stock: number;
  sold: number;
  revenue: number;
  profit: number;
}

export const ProductsReportTable = React.forwardRef<
  HTMLDivElement,
  ProductsReportTableProps
>(({ dateRange }, ref) => {
  // Create a ref for the component
  const componentRef = React.useRef<HTMLDivElement>(null);
  const resolvedRef = ref || componentRef;

  // Function to export data for Excel
  const exportData = () => {
    return products.map((product) => ({
      ID: product.id,
      "Nama Produk": product.name,
      Kategori: product.category,
      Stok: product.stock,
      Terjual: product.sold,
      Pendapatan: product.revenue,
      Keuntungan: product.profit,
    }));
  };

  // Expose the exportData function
  React.useImperativeHandle(resolvedRef, () => ({
    exportData,
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [sortField, setSortField] = useState<keyof ProductData>("sold");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch products data based on date range
  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        // Mock data - in a real app, this would be fetched from an API
        const mockProducts: ProductData[] = [
          {
            id: "P001",
            name: "Kopi Susu Gula Aren",
            category: "Minuman",
            stock: 45,
            sold: 150,
            revenue: 3000000,
            profit: 1500000,
          },
          {
            id: "P002",
            name: "Croissant Coklat",
            category: "Makanan",
            stock: 30,
            sold: 95,
            revenue: 1900000,
            profit: 950000,
          },
          {
            id: "P003",
            name: "Nasi Goreng Spesial",
            category: "Makanan",
            stock: 25,
            sold: 70,
            revenue: 1750000,
            profit: 875000,
          },
          {
            id: "P004",
            name: "Es Teh Manis",
            category: "Minuman",
            stock: 60,
            sold: 120,
            revenue: 1200000,
            profit: 840000,
          },
          {
            id: "P005",
            name: "Roti Bakar",
            category: "Makanan",
            stock: 40,
            sold: 85,
            revenue: 1275000,
            profit: 765000,
          },
        ];

        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products data");
        setLoading(false);
      }
    }, 1000);
  }, [dateRange]);

  // Handle sorting
  const handleSort = (field: keyof ProductData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort the data
  const sortedProducts = [...products].sort((a, b) => {
    if (
      sortField === "stock" ||
      sortField === "sold" ||
      sortField === "revenue" ||
      sortField === "profit"
    ) {
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

  // Get sort icon
  const getSortIcon = (field: keyof ProductData) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  // Get stock status badge
  const getStockStatusBadge = (stock: number) => {
    if (stock <= 10) {
      return (
        <Badge variant="destructive" className="whitespace-nowrap">
          Stok Habis
        </Badge>
      );
    } else if (stock <= 20) {
      return (
        <Badge variant="warning" className="whitespace-nowrap bg-amber-500">
          Stok Segera Habis
        </Badge>
      );
    } else {
      return (
        <Badge variant="success" className="whitespace-nowrap bg-green-500">
          Stok Tersedia
        </Badge>
      );
    }
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
    <div
      id="products-report-table"
      ref={resolvedRef}
      className="rounded-md border"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("id")}
            >
              ID {getSortIcon("id")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("name")}
            >
              Nama Produk {getSortIcon("name")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("category")}
            >
              Kategori {getSortIcon("category")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("stock")}
            >
              Stok {getSortIcon("stock")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("sold")}
            >
              Terjual {getSortIcon("sold")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("revenue")}
            >
              Pendapatan {getSortIcon("revenue")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSort("profit")}
            >
              Keuntungan {getSortIcon("profit")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Tidak ada data produk untuk periode ini
              </TableCell>
            </TableRow>
          ) : (
            sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.stock}
                    {getStockStatusBadge(product.stock)}
                  </div>
                </TableCell>
                <TableCell>{product.sold}</TableCell>
                <TableCell>{formatCurrency(product.revenue)}</TableCell>
                <TableCell>{formatCurrency(product.profit)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});

// Add display name
ProductsReportTable.displayName = "ProductsReportTable";
