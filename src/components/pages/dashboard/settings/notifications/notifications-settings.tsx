"use client";

import { useState } from "react";
import { BellIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function NotificationsSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [salesAlerts, setSalesAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [dailySummary, setDailySummary] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setIsLoading(false);
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <BellIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Pengaturan Notifikasi
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Atur preferensi notifikasi dan pemberitahuan
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Notifikasi Email
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola notifikasi yang dikirim ke alamat email Anda
          </p>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktifkan Notifikasi Email</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Terima semua notifikasi melalui email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {emailNotifications && (
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-indigo-100 dark:border-indigo-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pemberitahuan Penjualan</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Notifikasi saat ada penjualan baru
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={salesAlerts}
                    onChange={() => setSalesAlerts(!salesAlerts)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Peringatan Inventaris</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Notifikasi saat stok produk hampir habis
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={inventoryAlerts}
                    onChange={() => setInventoryAlerts(!inventoryAlerts)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Pemasaran</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Terima pembaruan fitur dan penawaran khusus
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={marketingEmails}
                    onChange={() => setMarketingEmails(!marketingEmails)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Summary Reports */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Laporan Ringkasan
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Atur frekuensi laporan ringkasan yang Anda terima
          </p>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Ringkasan Harian</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Terima laporan ringkasan aktivitas harian
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={dailySummary}
                  onChange={() => setDailySummary(!dailySummary)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Ringkasan Mingguan</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Terima laporan ringkasan aktivitas mingguan
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={weeklySummary}
                  onChange={() => setWeeklySummary(!weeklySummary)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Notifikasi Push
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fitur notifikasi push akan segera tersedia
          </p>
          
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
            <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Segera Hadir</h4>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              Kami sedang mengembangkan fitur notifikasi push untuk aplikasi web dan mobile. Fitur ini akan tersedia dalam pembaruan mendatang.
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {showSuccess && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 animate-fade-in">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-300">
                Pengaturan notifikasi berhasil disimpan!
              </p>
            </div>
          </div>
        )}

        {showError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 animate-fade-in">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
              <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-300">
                Terjadi kesalahan saat menyimpan pengaturan.
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isLoading}
            className={`px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
            }`}
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
