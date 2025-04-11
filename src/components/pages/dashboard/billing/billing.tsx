"use client";
import type { NextPage } from "next";
import { useState } from "react";
import {
  ReceiptRefundIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const BillingPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Sample billing data - in a real app, this would come from the database
  const invoices = [
    {
      id: "INV-001",
      date: "2023-10-15",
      amount: 250000,
      status: "paid",
      description: "Langganan Bulanan - Oktober 2023",
    },
    {
      id: "INV-002",
      date: "2023-11-15",
      amount: 250000,
      status: "paid",
      description: "Langganan Bulanan - November 2023",
    },
    {
      id: "INV-003",
      date: "2023-12-15",
      amount: 250000,
      status: "pending",
      description: "Langganan Bulanan - Desember 2023",
    },
  ];

  // Function to format currency in Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Lunas
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-400">
            <ClockIcon className="mr-1 h-3 w-3" />
            Menunggu
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-400">
            <ExclamationCircleIcon className="mr-1 h-3 w-3" />
            Terlambat
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Current Subscription Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <CreditCardIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Langganan Saat Ini
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Informasi langganan dan status pembayaran Anda
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 flex items-start gap-4">
            <div className="bg-indigo-100 dark:bg-indigo-800 rounded-full p-2">
              <ReceiptRefundIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-indigo-900 dark:text-indigo-300">
                Paket Bisnis
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                {formatCurrency(250000)} / bulan
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                Aktif hingga: 15 Januari 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <ReceiptRefundIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Riwayat Tagihan
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Daftar tagihan dan status pembayaran
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  No. Invoice
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Deskripsi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Jumlah
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(invoice.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {invoice.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      onClick={() => console.log(`View invoice ${invoice.id}`)}
                    >
                      Lihat
                    </button>
                    {invoice.status === "pending" && (
                      <button
                        className="ml-4 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        onClick={() => console.log(`Pay invoice ${invoice.id}`)}
                      >
                        Bayar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <CreditCardIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Metode Pembayaran
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Kelola metode pembayaran Anda
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 mr-4">
                <CreditCardIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Visa •••• 4242
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expires 12/2025
                </p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
                Default
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            <CreditCardIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Tambah Metode Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
