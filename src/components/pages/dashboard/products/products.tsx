"use client";

import type { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
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

// Import types and components
import { Product, StockCounts, Category, ColumnVisibility } from "./types";
import { StockSummaryCards } from "./components/StockSummaryCards";
import { ProductActions } from "./components/ProductActions";
import { ProductTableDesktop } from "./components/ProductTableDesktop";
import { ProductListMobile } from "./components/ProductListMobile";
import { NeedsApprovalTabContent } from "./components/NeedsApprovalTabContent";
import { WarehouseTabContent } from "./components/WarehouseTabContent";

interface ProductsPageProps {
  products: Product[];
  stockCounts: StockCounts;
  categories: Category[]; // Keep categories if needed for filtering/display elsewhere
}

const ProductsPage: NextPage<ProductsPageProps> = ({
  products,
  stockCounts,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mainTab, setMainTab] = useState("products");
  const [subTab, setSubTab] = useState("all-products");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products); // Initialize with products

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    sku: true,
    category: true,
    price: true,
    stock: true,
    cost: true,
    sellPrice: true,
    discountPrice: true,
  });

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Function to handle column sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new field, set it and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Function to get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowsUpDownIcon className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 ml-1" />
    );
  };

  // Filter and sort products based on search term, active tabs, and sort settings
  useEffect(() => {
    let result = [...products]; // Create a copy to avoid mutating the original

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.sku &&
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply tab filters
    if (mainTab === "products") {
      // No additional filtering for products tab
    } else if (mainTab === "warehouse") {
      // Warehouse tab logic could be added here
    }

    // Apply sub-tab filters
    if (subTab === "all-products") {
      // No additional filtering
    } else if (subTab === "needs-approval") {
      // In a real implementation, you would filter by approval status
      result = [];
    } else if (subTab === "low-stock") {
      result = result.filter(
        (product) => product.stock > 0 && product.stock <= 5
      );
    } else if (subTab === "out-of-stock") {
      result = result.filter((product) => product.stock === 0);
    }

    // Apply sorting if a sort field is selected
    if (sortField) {
      result.sort((a, b) => {
        let valueA, valueB;

        // Handle different field types
        switch (sortField) {
          case "name":
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
            break;
          case "sku":
            valueA = (a.sku || "").toLowerCase();
            valueB = (b.sku || "").toLowerCase();
            break;
          case "category":
            valueA = (a.category?.name || "").toLowerCase();
            valueB = (b.category?.name || "").toLowerCase();
            break;
          case "price":
            valueA = a.price;
            valueB = b.price;
            break;
          case "stock":
            valueA = a.stock;
            valueB = b.stock;
            break;
          case "cost":
            valueA = a.cost || 0;
            valueB = b.cost || 0;
            break;
          default:
            valueA = a[sortField as keyof Product] || "";
            valueB = b[sortField as keyof Product] || "";
        }

        // Compare based on direction
        if (sortDirection === "asc") {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      });
    }

    setFilteredProducts(result);
  }, [products, searchTerm, mainTab, subTab, sortField, sortDirection]);

  // Function to get stock status badge
  const getStockStatusBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="whitespace-nowrap">
          <XCircleIcon className="h-3 w-3 mr-1" />
          Habis
        </Badge>
      );
    } else if (stock <= 5) {
      return (
        <Badge variant="default" className="bg-amber-500 whitespace-nowrap">
          <ExclamationCircleIcon className="h-3 w-3 mr-1" />
          Segera Habis
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="bg-green-500 whitespace-nowrap">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Tersedia
        </Badge>
      );
    }
  };

  return (
    <DashboardLayout pageTitle="Produk">
      <Head>
        <title>Produk - Kasir Online</title>
      </Head>

      <div className="space-y-6">
        {/* Main Tabs */}
        <Tabs
          defaultValue="products"
          value={mainTab}
          onValueChange={setMainTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="products">Produk / Jasa</TabsTrigger>
            <TabsTrigger value="warehouse">Gudang</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Stock Status Summary Cards */}
            <StockSummaryCards stockCounts={stockCounts} />

            {/* Sub Tabs */}
            <Tabs
              defaultValue="all-products"
              value={subTab}
              onValueChange={setSubTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all-products">Daftar Produk</TabsTrigger>
                <TabsTrigger value="needs-approval">
                  Produk Perlu Persetujuan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all-products" className="space-y-6">
                {/* Header Actions */}
                <ProductActions
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

                {/* Products List */}
                <div className="overflow-x-auto">
                  {/* Desktop Table View */}
                  <ProductTableDesktop
                    products={filteredProducts}
                    columnVisibility={columnVisibility}
                    handleSort={handleSort}
                    getSortIcon={getSortIcon}
                    getStockStatusBadge={getStockStatusBadge}
                    searchTerm={searchTerm}
                  />

                  {/* Mobile Card View */}
                  <ProductListMobile
                    products={filteredProducts}
                    getStockStatusBadge={getStockStatusBadge}
                    searchTerm={searchTerm}
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
    </DashboardLayout>
  );
};

export default ProductsPage;
