"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Customer } from "@prisma/client";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface CustomersPageProps {
  customers: Customer[];
}

const CustomersPage: React.FC<CustomersPageProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Cari pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto"
          >
            <FunnelIcon className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            Filter
          </button>
          <Link href="/dashboard/customers/new" legacyBehavior>
            <a className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto">
              <PlusIcon className="mr-2 h-5 w-5" />
              Tambah Pelanggan
            </a>
          </Link>
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        {/* Desktop Table View - shadcn style */}
        <div className="relative overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg hidden sm:block">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nama Pelanggan
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
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.contactName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        legacyBehavior
                      >
                        <a className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium">
                          Detail
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchTerm
                      ? "Tidak ada pelanggan yang sesuai dengan pencarian."
                      : "Belum ada data pelanggan. Tambahkan pelanggan baru."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-4">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {customer.name}
                  </h3>
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    legacyBehavior
                  >
                    <a className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium">
                      Detail
                    </a>
                  </Link>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Kontak:
                    </span>{" "}
                    {customer.contactName || "-"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Email:
                    </span>{" "}
                    {customer.email || "-"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Telepon:
                    </span>{" "}
                    {customer.phone || "-"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Terdaftar:
                    </span>{" "}
                    {format(new Date(customer.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "Tidak ada pelanggan yang sesuai dengan pencarian."
                : "Belum ada data pelanggan. Tambahkan pelanggan baru."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
