"use client";

import type { NextPage } from "next";
import Head from "next/head";
import {
  ExclamationCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";

// Import types and components
import { Sale, SaleCounts, ColumnVisibility } from "./types";
import { SaleSummaryCards } from "./components/SaleSummaryCards";
import { SaleActions } from "./components/SaleActions";
import { SaleTableDesktop } from "./components/SaleTableDesktop";
import { NeedsApprovalTabContent } from "./components/NeedsApprovalTabContent";
import { WarehouseTabContent } from "./components/WarehouseTabContent";

interface SalesPageProps {
  sales: Sale[];
}

const SalesPage: NextPage<SalesPageProps> = ({ sales }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mainTab, setMainTab] = useState("sales");
  const [subTab, setSubTab] = useState("all-sales");
  const [filteredSales, setFilteredSales] = useState<Sale[]>(sales);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedSales, setPaginatedSales] = useState<Sale[]>([]);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    date: true,
    itemCount: true,
    totalAmount: true,
  });

  // Calculate sale counts for the summary cards
  const saleCounts: SaleCounts = {
    total: sales.length,
    today: sales.filter((s) => {
      const now = new Date();
      const saleDate = new Date(s.saleDate);
      return (
        saleDate.getDate() === now.getDate() &&
        saleDate.getMonth() === now.getMonth() &&
        saleDate.getFullYear() === now.getFullYear()
      );
    }).length,
    thisMonth: sales.filter((s) => {
      const now = new Date();
      const saleDate = new Date(s.saleDate);
      return (
        saleDate.getMonth() === now.getMonth() &&
        saleDate.getFullYear() === now.getFullYear()
      );
    }).length,
    pending: 0, // This would normally be calculated from the data
  };

  // Filter sales based on search term
  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);

    if (!searchTerm.trim()) {
      setFilteredSales(sales);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = sales.filter((sale) => {
      return sale.id.toLowerCase().includes(lowercasedTerm);
    });

    setFilteredSales(filtered);
  }, [searchTerm, sales]);

  // Apply pagination to filtered sales
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedSales(filteredSales.slice(startIndex, endIndex));
  }, [filteredSales, currentPage, itemsPerPage]);

  // Sort sales
  const handleSort = (field: string) => {
    // Reset to first page when sorting changes
    setCurrentPage(1);

    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }

    // Sort the filtered sales
    const sortedSales = [...filteredSales].sort((a, b) => {
      let aValue, bValue;

      // Handle special case for itemCount which is derived
      if (field === "itemCount") {
        aValue = a.items.length;
        bValue = b.items.length;
      } else {
        // Handle other fields
        aValue = a[field as keyof Sale] || "";
        bValue = b[field as keyof Sale] || "";
      }

      // Compare values
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredSales(sortedSales);
  };

  // Get sort icon based on current sort state
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowsUpDownIcon className="h-4 w-4 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 ml-1" />
    );
  };

  return (
    <>
      <Head>
        <title>Penjualan - Kasir Online</title>
      </Head>

      <div className="space-y-6">
        {/* Main Tabs */}
        <Tabs
          defaultValue="sales"
          value={mainTab}
          onValueChange={setMainTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="sales">Penjualan</TabsTrigger>
            <TabsTrigger value="outlets">Outlet</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            {/* Sale Status Summary Cards */}
            <SaleSummaryCards saleCounts={saleCounts} />

            {/* Sub Tabs */}
            <Tabs
              defaultValue="all-sales"
              value={subTab}
              onValueChange={setSubTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all-sales">Daftar Penjualan</TabsTrigger>
                <TabsTrigger value="needs-approval">
                  Penjualan Perlu Persetujuan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all-sales" className="space-y-6">
                {/* Header Actions */}
                <SaleActions
                  columnVisibility={columnVisibility}
                  setColumnVisibility={setColumnVisibility}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onFilterClick={() =>
                    toast.info("Fitur filter akan segera hadir!")
                  }
                  onImportClick={() =>
                    toast.info("Fitur import akan segera hadir!")
                  }
                  onExportClick={() =>
                    toast.info("Fitur export akan segera hadir!")
                  }
                />

                {/* Sales List */}
                <div className="overflow-x-auto">
                  {/* Table View */}
                  <SaleTableDesktop
                    sales={paginatedSales}
                    columnVisibility={columnVisibility}
                    handleSort={handleSort}
                    getSortIcon={getSortIcon}
                    searchTerm={searchTerm}
                  />
                </div>

                {/* Pagination - Moved outside the overflow container */}
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredSales.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    totalItems={filteredSales.length}
                  />
                </div>
              </TabsContent>

              <TabsContent value="needs-approval" className="space-y-6">
                <NeedsApprovalTabContent />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="outlets" className="space-y-6">
            <WarehouseTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SalesPage;
