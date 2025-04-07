"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Supplier } from "@prisma/client";
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface SuppliersPageProps {
  suppliers: Supplier[];
}

const SuppliersPage: React.FC<SuppliersPageProps> = ({ suppliers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchLower) ||
      (supplier.email && supplier.email.toLowerCase().includes(searchLower)) ||
      (supplier.phone && supplier.phone.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Cari supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto"
          >
            <FunnelIcon className="mr-2 h-5 w-5 text-gray-400" />
            Filter
          </button>
          <Link href="/dashboard/suppliers/new" legacyBehavior>
            <a className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto">
              <PlusIcon className="mr-2 h-5 w-5" />
              Tambah Supplier
            </a>
          </Link>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="space-y-4">
        {/* Desktop Table View - shadcn style */}
        <div className="relative overflow-x-auto border border-gray-200 rounded-lg hidden sm:block">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nama Supplier
                </th>
                <th scope="col" className="px-6 py-3">
                  Kontak
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Telepon
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {supplier.contactName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {supplier.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {supplier.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                      <Link
                        href={`/dashboard/suppliers/${supplier.id}`}
                        legacyBehavior
                      >
                        <a className="text-indigo-600 hover:text-indigo-900 font-medium">
                          Detail
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b">
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm
                      ? "Tidak ada supplier yang sesuai dengan pencarian."
                      : "Belum ada data supplier. Tambahkan supplier baru."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-4">
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    {supplier.name}
                  </h3>
                  <Link href={`/dashboard/suppliers/${supplier.id}`} legacyBehavior>
                    <a className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
                      Detail
                    </a>
                  </Link>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Kontak:</span>{" "}
                    {supplier.contactName || "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Email:</span>{" "}
                    {supplier.email || "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Telepon:</span>{" "}
                    {supplier.phone || "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Terdaftar:</span>{" "}
                    {format(new Date(supplier.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center text-gray-500">
              {searchTerm
                ? "Tidak ada supplier yang sesuai dengan pencarian."
                : "Belum ada data supplier. Tambahkan supplier baru."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;
