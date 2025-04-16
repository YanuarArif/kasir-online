"use client";

import React, { useState, useEffect } from "react";
import { Customer as PrismaCustomer } from "@prisma/client";
import { toast } from "sonner";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { format } from "date-fns";

// Import types and components
import { Customer, ColumnVisibility, CustomerStatus } from "./types";
import { CustomerStatusCards } from "./components/CustomerStatusCards";
import { CustomerActions } from "./components/CustomerActions";
import { CustomerTableDesktop } from "./components/CustomerTableDesktop";

interface CustomersPageProps {
  customers: PrismaCustomer[];
}

const CustomersPage: React.FC<CustomersPageProps> = ({
  customers: initialCustomers,
}) => {
  // Convert Prisma customers to our Customer type - using useMemo to avoid recalculation on every render
  const customers = React.useMemo<Customer[]>(() => {
    return initialCustomers.map((customer) => ({
      ...customer,
      createdAt: new Date(customer.createdAt),
      updatedAt: new Date(customer.updatedAt),
    }));
  }, [initialCustomers]);

  // State for search, sort, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [paginatedCustomers, setPaginatedCustomers] = useState<Customer[]>([]);

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

  // Calculate customer status - using useMemo to avoid recalculation on every render
  const customerStatus = React.useMemo<CustomerStatus>(
    () => ({
      total: customers.length,
      active: Math.round(customers.length * 0.8), // Mocking active customers (80%)
      inactive: Math.round(customers.length * 0.2), // Mocking inactive customers (20%)
    }),
    [customers.length]
  );

  // Initialize filtered customers when customers data changes
  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  // Filter and sort customers based on search term and sort settings
  useEffect(() => {
    let result = [...customers]; // Create a copy to avoid mutating the original

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.email &&
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (customer.phone &&
            customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (customer.contactName &&
            customer.contactName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any = a[sortField as keyof Customer];
      let bValue: any = b[sortField as keyof Customer];

      // Handle null values
      if (aValue === null) return sortDirection === "asc" ? -1 : 1;
      if (bValue === null) return sortDirection === "asc" ? 1 : -1;

      // Convert to lowercase for string comparison
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      // Compare values
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCustomers(result);
  }, [customers, searchTerm, sortField, sortDirection]);

  // Apply pagination to filtered customers
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedCustomers(filteredCustomers.slice(startIndex, endIndex));
  }, [filteredCustomers, currentPage, itemsPerPage]);

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
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <CustomerStatusCards customerStatus={customerStatus} />

      {/* Tabs */}
      <Tabs defaultValue="all-customers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-customers">Semua Pelanggan</TabsTrigger>
          <TabsTrigger value="by-category">Berdasarkan Kategori</TabsTrigger>
        </TabsList>

        <TabsContent value="all-customers" className="space-y-6">
          {/* Header Actions */}
          <CustomerActions
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onFilterClick={() => toast.info("Fitur filter akan segera hadir!")}
            onImportClick={() => toast.info("Fitur import akan segera hadir!")}
            onExportClick={() => toast.info("Fitur export akan segera hadir!")}
          />

          {/* Customers List */}
          <div className="overflow-x-auto">
            {/* Table View */}
            <CustomerTableDesktop
              customers={paginatedCustomers}
              columnVisibility={columnVisibility}
              handleSort={handleSort}
              getSortIcon={getSortIcon}
              searchTerm={searchTerm}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga{" "}
                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}{" "}
                dari {filteredCustomers.length} pelanggan
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                >
                  Berikutnya
                </button>
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

export default CustomersPage;
