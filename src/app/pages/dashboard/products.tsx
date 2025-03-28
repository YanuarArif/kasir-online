// pages/dashboard/products.tsx
"use client";

import type { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import Link from "next/link"; // <--- Import Link

// --- Mock Product Data Type ---
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}
// --- ---

const ProductsPage: NextPage = () => {
  // Keep the product data state if you want the main list to be dynamic
  const [productsData, setProductsData] = useState<Product[]>([
    {
      id: "P001",
      name: "Kopi Susu Gula Aren",
      category: "Minuman",
      price: 18000,
      stock: 50,
      image: "/placeholder-image.png",
    },
    {
      id: "P002",
      name: "Croissant Coklat",
      category: "Roti",
      price: 15000,
      stock: 35,
      image: "/placeholder-image.png",
    },
    {
      id: "P003",
      name: "Teh Melati",
      category: "Minuman",
      price: 10000,
      stock: 100,
      image: "/placeholder-image.png",
    },
    {
      id: "P004",
      name: "Nasi Goreng Spesial",
      category: "Makanan",
      price: 25000,
      stock: 20,
      image: "/placeholder-image.png",
    },
  ]);

  return (
    <DashboardLayout pageTitle="Produk">
      <Head>
        <title>Produk - Kasir Online</title>
      </Head>

      {/* Page Content */}
      <div className="space-y-6">
        {/* Header Actions (Search, Add) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Search Input... (keep as is) */}
          <div className="relative flex-grow w-full sm:w-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              placeholder="Cari Produk (Nama, Kategori)"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* --- UPDATE BUTTON TO LINK --- */}
          <Link href="/dashboard/products/new" legacyBehavior>
            <a className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto">
              <PlusIcon className="mr-2 h-5 w-5" />
              Tambah Produk Baru
            </a>
          </Link>
          {/* --- --- */}
        </div>

        {/* Products Table/List... (keep as is) */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            {/* ... thead ... */}
            <thead className="bg-gray-50">
              {/* ... table headers ... */}
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Nama Produk
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Kategori
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Harga
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Stok
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            {/* ... tbody ... */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {productsData.map((product) => (
                // ... table rows as before ...
                <tr key={product.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      {/* Placeholder Image */}
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          img
                        </div>
                        {/* <Image className="h-10 w-10 rounded-full" src={product.image} alt="" width={40} height={40}/> */}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          ID: {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {product.stock > 0 ? (
                      product.stock
                    ) : (
                      <span className="text-red-600">Habis</span>
                    )}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Ubah
                    </a>
                    <a href="#" className="text-red-600 hover:text-red-900">
                      Hapus
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
