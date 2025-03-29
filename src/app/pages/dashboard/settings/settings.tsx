"use client";
import type { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import {
  BuildingStorefrontIcon,
  UserCircleIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const SettingsPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DashboardLayout pageTitle="Pengaturan">
      <Head>
        <title>Pengaturan - Kasir Online</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Profile Settings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <UserCircleIcon className="h-6 w-6 text-gray-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Profil Pengguna
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Kelola informasi pribadi dan preferensi akun Anda
              </p>
            </div>
          </div>

          <form className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Depan
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  defaultValue="Nama"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan nama depan"
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Belakang
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  defaultValue="Pengguna"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan nama belakang"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alamat Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue="pengguna@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan alamat email"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>

        {/* Store Settings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <BuildingStorefrontIcon className="h-6 w-6 text-gray-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pengaturan Toko
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Atur detail informasi toko atau bisnis Anda
              </p>
            </div>
          </div>

          <form className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="store-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Toko
                </label>
                <input
                  type="text"
                  name="store-name"
                  id="store-name"
                  defaultValue="Toko Saya"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan nama toko"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="store-address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alamat Toko
                </label>
                <textarea
                  id="store-address"
                  name="store-address"
                  rows={3}
                  defaultValue="Jl. Contoh No. 123"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
                  placeholder="Masukkan alamat lengkap toko"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  defaultValue="+6281234567890"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan nomor telepon"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>

        {/* Payment Settings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <CreditCardIcon className="h-6 w-6 text-gray-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Metode Pembayaran
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Kelola opsi pembayaran yang diterima pelanggan
              </p>
            </div>
          </div>

          <form className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Tunai</h3>
                  <p className="text-xs text-gray-500">
                    Pembayaran langsung dengan uang tunai
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Transfer Bank
                  </h3>
                  <p className="text-xs text-gray-500">
                    Pembayaran via transfer bank
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
