"use client";

import type { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  CubeIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  cost: number | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  category: Category | null;
}

interface StockCounts {
  available: number;
  low: number;
  outOfStock: number;
  needsApproval: number;
}

interface ProductsPageProps {
  products: Product[];
  stockCounts: StockCounts;
  categories: Category[];
}

const ProductsPage: NextPage<ProductsPageProps> = ({
  products,
  stockCounts,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mainTab, setMainTab] = useState("products");
  const [subTab, setSubTab] = useState("all-products");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Filter products based on search term and active tabs
  useEffect(() => {
    let result = products;

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

    setFilteredProducts(result);
  }, [products, searchTerm, mainTab, subTab]);

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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SummaryCard
                title="Stok Tersedia"
                value={stockCounts.available.toString()}
                icon={<CheckCircleIcon className="h-5 w-5" />}
                colorScheme="emerald"
              />

              <SummaryCard
                title="Stok Segera Habis"
                value={stockCounts.low.toString()}
                icon={<ExclamationCircleIcon className="h-5 w-5" />}
                colorScheme="amber"
              />

              <SummaryCard
                title="Stok Habis"
                value={stockCounts.outOfStock.toString()}
                icon={<XCircleIcon className="h-5 w-5" />}
                colorScheme="rose"
              />
            </div>

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
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative flex-grow w-full sm:w-auto">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400 dark:text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Cari Produk (Nama, ID, SKU)"
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Link href="/dashboard/products/new" legacyBehavior>
                    <a className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto">
                      <PlusIcon className="mr-2 h-5 w-5" />
                      Tambah Produk Baru
                    </a>
                  </Link>
                </div>

                {/* Products List */}
                <div className="overflow-x-auto">
                  {/* Desktop Table View - shadcn style */}
                  <div className="relative overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg hidden md:block">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Nama Produk
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Kode Produk
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Kategori Produk
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Harga
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Total Stok
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Harga Beli
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Harga Jual
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Harga Diskon
                          </th>
                          <th scope="col" className="px-6 py-3 text-right">
                            <span className="sr-only">Aksi</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <tr
                              key={product.id}
                              className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                {product.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {product.sku || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {product.category?.name || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                Rp {product.price.toLocaleString("id-ID")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {getStockStatusBadge(product.stock)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {product.cost
                                  ? `Rp ${product.cost.toLocaleString("id-ID")}`
                                  : "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                Rp {product.price.toLocaleString("id-ID")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                -
                              </td>
                              <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                                <Link
                                  href={`/dashboard/products/${product.id}`}
                                  legacyBehavior
                                >
                                  <a className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                                    Detail
                                  </a>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={9}
                              className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                            >
                              {searchTerm
                                ? "Tidak ada produk yang sesuai dengan pencarian."
                                : "Belum ada data produk."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div key={product.id} className="p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Nama:
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {product.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Kode:
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {product.sku || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Kategori:
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {product.category?.name || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Harga Jual:
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              Rp {product.price.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Stok:
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {getStockStatusBadge(product.stock)}
                            </span>
                          </div>
                          <div className="text-right">
                            <Link
                              href={`/dashboard/products/${product.id}`}
                              legacyBehavior
                            >
                              <a className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                Detail
                              </a>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm
                          ? "Tidak ada produk yang sesuai dengan pencarian."
                          : "Belum ada data produk."}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="needs-approval" className="space-y-6">
                <div className="p-8 text-center">
                  <ClockIcon className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Produk Perlu Persetujuan
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada produk yang memerlukan persetujuan saat ini.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="warehouse" className="space-y-6">
            <div className="p-8 text-center">
              <BuildingStorefrontIcon className="h-12 w-12 mx-auto text-indigo-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Manajemen Gudang
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Fitur manajemen gudang akan segera hadir. Anda akan dapat
                mengelola stok di berbagai lokasi gudang.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
