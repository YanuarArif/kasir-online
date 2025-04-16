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
import { Purchase, PurchaseCounts, ColumnVisibility } from "./types";
import { PurchaseSummaryCards } from "./components/StockSummaryCards";
import { PurchaseActions } from "./components/PurchaseActions";
import { PurchaseTableDesktop } from "./components/PurchaseTableDesktop";
import { NeedsApprovalTabContent } from "./components/NeedsApprovalTabContent";
import { WarehouseTabContent } from "./components/WarehouseTabContent";

interface PurchasesPageProps {
  purchases: Purchase[];
}

const PurchasesPage: NextPage<PurchasesPageProps> = ({ purchases }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mainTab, setMainTab] = useState("purchases");
  const [subTab, setSubTab] = useState("all-purchases");
  const [filteredPurchases, setFilteredPurchases] =
    useState<Purchase[]>(purchases);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedPurchases, setPaginatedPurchases] = useState<Purchase[]>([]);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    date: true,
    supplier: true,
    totalAmount: true,
    invoiceRef: true,
    itemCount: true,
  });

  // Mock purchase counts for the summary cards
  const purchaseCounts: PurchaseCounts = {
    total: purchases.length,
    thisMonth: purchases.filter((p) => {
      const now = new Date();
      const purchaseDate = new Date(p.purchaseDate);
      return (
        purchaseDate.getMonth() === now.getMonth() &&
        purchaseDate.getFullYear() === now.getFullYear()
      );
    }).length,
    lastMonth: 0, // This would normally be calculated from the data
    pending: 0, // This would normally be calculated from the data
  };

  // Filter purchases based on search term
  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);

    if (!searchTerm.trim()) {
      setFilteredPurchases(purchases);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = purchases.filter((purchase) => {
      return (
        purchase.id.toLowerCase().includes(lowercasedTerm) ||
        (purchase.supplier?.name &&
          purchase.supplier.name.toLowerCase().includes(lowercasedTerm)) ||
        (purchase.invoiceRef &&
          purchase.invoiceRef.toLowerCase().includes(lowercasedTerm))
      );
    });

    setFilteredPurchases(filtered);
  }, [searchTerm, purchases]);

  // Apply pagination to filtered purchases
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedPurchases(filteredPurchases.slice(startIndex, endIndex));
  }, [filteredPurchases, currentPage, itemsPerPage]);

  // Sort purchases
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

    // Sort the filtered purchases
    const sortedPurchases = [...filteredPurchases].sort((a, b) => {
      let aValue, bValue;

      // Handle special case for itemCount which is derived
      if (field === "itemCount") {
        aValue = a.items.length;
        bValue = b.items.length;
      } else if (field === "supplier") {
        // Handle supplier name sorting
        aValue = a.supplier?.name || "";
        bValue = b.supplier?.name || "";
      } else {
        // Handle other fields
        aValue = a[field as keyof Purchase] || "";
        bValue = b[field as keyof Purchase] || "";
      }

      // Compare values
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredPurchases(sortedPurchases);
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
        <title>Pembelian - Kasir Online</title>
      </Head>

      <div className="space-y-6">
        {/* Main Tabs */}
        <Tabs
          defaultValue="purchases"
          value={mainTab}
          onValueChange={setMainTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="purchases">Pembelian</TabsTrigger>
            <TabsTrigger value="warehouse">Gudang</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="space-y-6">
            {/* Purchase Status Summary Cards */}
            <PurchaseSummaryCards purchaseCounts={purchaseCounts} />

            {/* Sub Tabs */}
            <Tabs
              defaultValue="all-purchases"
              value={subTab}
              onValueChange={setSubTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all-purchases">
                  Daftar Pembelian
                </TabsTrigger>
                <TabsTrigger value="needs-approval">
                  Pembelian Perlu Persetujuan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all-purchases" className="space-y-6">
                {/* Header Actions */}
                <PurchaseActions
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

                {/* Purchases List */}
                <div className="overflow-x-auto">
                  {/* Table View */}
                  <PurchaseTableDesktop
                    purchases={paginatedPurchases}
                    columnVisibility={columnVisibility}
                    handleSort={handleSort}
                    getSortIcon={getSortIcon}
                    searchTerm={searchTerm}
                  />

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      filteredPurchases.length / itemsPerPage
                    )}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    totalItems={filteredPurchases.length}
                  />
                </div>
              </TabsContent>

              <TabsContent value="needs-approval" className="space-y-6">
                <NeedsApprovalTabContent />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="warehouse" className="space-y-6">
            <WarehouseTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PurchasesPage;
