"use client";

import { useState } from "react";
import { ShieldCheckIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [loginNotifications, setLoginNotifications] = useState(true);
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
        <ShieldCheckIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Pengaturan Keamanan
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Kelola pengaturan keamanan dan autentikasi akun Anda
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Autentikasi Dua Faktor
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tingkatkan keamanan akun Anda dengan autentikasi dua faktor
          </p>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktifkan Autentikasi Dua Faktor</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Memerlukan kode verifikasi tambahan saat login
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
              <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Pengaturan Autentikasi Dua Faktor</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 mb-4">
                Fitur ini akan segera tersedia. Anda akan dapat menggunakan aplikasi autentikator atau SMS untuk verifikasi.
              </p>
              <button
                type="button"
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 dark:bg-indigo-700 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                disabled
              >
                Konfigurasi 2FA
              </button>
            </div>
          )}
        </div>

        {/* Session Settings */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Pengaturan Sesi
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola durasi dan perilaku sesi login Anda
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="session-timeout" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Batas Waktu Sesi (menit)
              </label>
              <select
                id="session-timeout"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
              >
                <option value="15">15 menit</option>
                <option value="30">30 menit</option>
                <option value="60">1 jam</option>
                <option value="120">2 jam</option>
                <option value="240">4 jam</option>
                <option value="480">8 jam</option>
                <option value="1440">24 jam</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sesi Anda akan berakhir secara otomatis setelah tidak aktif selama periode ini
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifikasi Login</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Kirim notifikasi email saat ada login baru ke akun Anda
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={loginNotifications}
                  onChange={() => setLoginNotifications(!loginNotifications)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Device Management */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Manajemen Perangkat
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lihat dan kelola perangkat yang terhubung ke akun Anda
          </p>
          
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Chrome - Windows</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Perangkat ini • Login terakhir: Hari ini, 10:30
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 border border-red-200 dark:border-red-800/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Safari - macOS</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Login terakhir: 2 hari yang lalu
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 border border-red-200 dark:border-red-800/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
            
            <button
              type="button"
              className="w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800/30 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
            >
              Logout dari Semua Perangkat
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {showSuccess && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 animate-fade-in">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-300">
                Pengaturan keamanan berhasil disimpan!
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
