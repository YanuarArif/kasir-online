"use client";

import React, { useState, useEffect } from "react";
import { Supplier as PrismaSupplier } from "@prisma/client";
import { toast } from "sonner";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import types and components
import { Supplier, ColumnVisibility, SupplierStatus } from "./types";
import { SupplierStatusCards } from "./components/SupplierStatusCards";
import { SupplierActions } from "./components/SupplierActions";
import { SupplierTableDesktop } from "./components/SupplierTableDesktop";

interface SuppliersPageProps {
  suppliers: PrismaSupplier[];
}

const SuppliersPage: React.FC<SuppliersPageProps> = ({
  suppliers: initialSuppliers,
}) => {
  // Convert Prisma suppliers to our Supplier type - using useMemo to avoid recalculation on every render
  const suppliers = React.useMemo<Supplier[]>(() => {
    return initialSuppliers.map((supplier) => ({
      ...supplier,
      createdAt: new Date(supplier.createdAt),
      updatedAt: new Date(supplier.updatedAt),
    }));
  }, [initialSuppliers]);

  // State for search, sort, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [paginatedSuppliers, setPaginatedSuppliers] = useState<Supplier[]>([]);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    contactName: true,
    email: true,
    phone: true,
    address: false,
    createdAt: false,
    updatedAt: false,
    notes: false,
  });

  // Calculate supplier status - using useMemo to avoid recalculation on every render
  const supplierStatus = React.useMemo<SupplierStatus>(
    () => ({
      total: suppliers.length,
      active: Math.round(suppliers.length * 0.8), // Mocking active suppliers (80%)
      inactive: Math.round(suppliers.length * 0.2), // Mocking inactive suppliers (20%)
    }),
    [suppliers.length]
  );

  // Initialize filtered suppliers when suppliers data changes
  useEffect(() => {
    setFilteredSuppliers(suppliers);
  }, [suppliers]);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  // Filter and sort suppliers based on search term and sort settings
  useEffect(() => {
    let result = [...suppliers]; // Create a copy to avoid mutating the original

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (supplier.email &&
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (supplier.phone &&
            supplier.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (supplier.contactName &&
            supplier.contactName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        // Handle different field types
        let valueA = a[sortField as keyof Supplier];
        let valueB = b[sortField as keyof Supplier];

        // Handle null values
        if (valueA === null) valueA = "";
        if (valueB === null) valueB = "";

        // Compare based on direction
        if (sortDirection === "asc") {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      });
    }

    setFilteredSuppliers(result);
  }, [suppliers, searchTerm, sortField, sortDirection]);

  // Apply pagination to filtered suppliers
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedSuppliers(filteredSuppliers.slice(startIndex, endIndex));
  }, [filteredSuppliers, currentPage, itemsPerPage]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon for table headers
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ArrowUpIcon className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-1 h-4 w-4" />
    );
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <SupplierStatusCards supplierStatus={supplierStatus} />

      {/* Tabs */}
      <Tabs defaultValue="all-suppliers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-suppliers">Semua Supplier</TabsTrigger>
          <TabsTrigger value="by-category">Berdasarkan Kategori</TabsTrigger>
        </TabsList>

        <TabsContent value="all-suppliers" className="space-y-6">
          {/* Header Actions */}
          <SupplierActions
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onFilterClick={() => toast.info("Fitur filter akan segera hadir!")}
            onImportClick={() => toast.info("Fitur import akan segera hadir!")}
            onExportClick={() => toast.info("Fitur export akan segera hadir!")}
          />

          {/* Suppliers List */}
          <div className="overflow-x-auto">
            {/* Table View */}
            <SupplierTableDesktop
              suppliers={paginatedSuppliers}
              columnVisibility={columnVisibility}
              handleSort={handleSort}
              getSortIcon={getSortIcon}
              searchTerm={searchTerm}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">
                      {filteredSuppliers.length > 0
                        ? (currentPage - 1) * itemsPerPage + 1
                        : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredSuppliers.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredSuppliers.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center border ${
                            page === currentPage
                              ? "z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-500 text-indigo-600 dark:text-indigo-300"
                              : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                          } px-4 py-2 text-sm font-medium`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="by-category" className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Fitur pengelompokan berdasarkan kategori akan segera hadir!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuppliersPage;
