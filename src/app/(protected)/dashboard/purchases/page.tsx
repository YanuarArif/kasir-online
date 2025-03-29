// pages/dashboard/purchases.tsx
import type { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout"; // Adjust path if needed
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const PurchasesPage: NextPage = () => {
  // Dummy data for example purchases/procurement
  const purchasesData = [
    {
      id: "PO-2024-001",
      date: "2024-03-12",
      supplier: "Supplier Kopi Utama",
      total: 2500000,
      status: "Diterima",
    },
    {
      id: "PO-2024-002",
      date: "2024-03-14",
      supplier: "Pemasok Kemasan ABC",
      total: 750000,
      status: "Dibayar",
    },
    {
      id: "PO-2024-003",
      date: "2024-03-15",
      supplier: "Distributor Bahan Kue",
      total: 1200000,
      status: "Dikirim",
    },
    {
      id: "PO-2024-004",
      date: "2024-03-16",
      supplier: "Supplier Kopi Utama",
      total: 3000000,
      status: "Pending",
    },
    {
      id: "PO-2024-005",
      date: "2024-03-17",
      supplier: "Toko Grosir XYZ",
      total: 500000,
      status: "Diterima",
    },
  ];

  // Function to determine badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "diterima":
        return "bg-green-100 text-green-800";
      case "dibayar":
        return "bg-blue-100 text-blue-800";
      case "dikirim":
        return "bg-cyan-100 text-cyan-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout pageTitle="Pembelian">
      <Head>
        <title>Pembelian - Kasir Online</title>
      </Head>

      {/* Page Content */}
      <div className="space-y-6">
        {/* Header Actions (Filter, Search, Add) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-grow w-full sm:w-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              placeholder="Cari Pembelian (ID, Supplier)"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto">
              <FunnelIcon className="mr-2 h-5 w-5 text-gray-400" />
              Filter
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto">
              <PlusIcon className="mr-2 h-5 w-5" />
              Catat Pembelian Baru
            </button>
          </div>
        </div>

        {/* Purchases Table */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  ID Pembelian
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Supplier
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total Biaya
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {purchasesData.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {purchase.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {purchase.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {purchase.supplier}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    Rp {purchase.total.toLocaleString("id-ID")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                        purchase.status
                      )}`}
                    >
                      {purchase.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                    {/* Example Actions - Adapt as needed */}
                    {purchase.status !== "Diterima" &&
                      purchase.status !== "Dibayar" &&
                      purchase.status !== "Dibatalkan" && (
                        <a
                          href="#"
                          className="text-green-600 hover:text-green-900"
                        >
                          Tandai Diterima
                        </a>
                      )}
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))}
              {/* Add row for when data is empty */}
              {purchasesData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500"
                  >
                    Belum ada data pembelian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Add Pagination here if needed */}
      </div>
    </DashboardLayout>
  );
};

export default PurchasesPage;
