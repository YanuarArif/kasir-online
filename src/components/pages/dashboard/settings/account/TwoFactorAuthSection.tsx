"use client";

import { useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function TwoFactorAuthSection() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Toggle the state
      setIsEnabled(!isEnabled);
      
      // Show a message that this is just a UI demo
      if (!isEnabled) {
        alert("Fitur 2FA belum diimplementasikan. Ini hanya UI demo.");
      }
    } catch (error) {
      console.error("Error toggling 2FA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <ShieldCheckIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Autentikasi Dua Faktor
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Tingkatkan keamanan akun Anda dengan autentikasi dua faktor
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
              Status Autentikasi Dua Faktor
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {isEnabled 
                ? "Autentikasi dua faktor diaktifkan. Akun Anda lebih aman." 
                : "Autentikasi dua faktor dinonaktifkan. Aktifkan untuk keamanan tambahan."}
            </p>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            Apa itu Autentikasi Dua Faktor?
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Autentikasi dua faktor (2FA) menambahkan lapisan keamanan tambahan untuk akun Anda. 
            Selain password, Anda akan memerlukan kode verifikasi saat login. 
            Kode ini biasanya dikirim melalui SMS atau aplikasi autentikator.
          </p>
        </div>

        {isEnabled && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Metode Verifikasi
            </h4>
            
            <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <input
                id="sms-method"
                name="verification-method"
                type="radio"
                defaultChecked
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="sms-method" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                SMS ke nomor telepon terdaftar
              </label>
            </div>
            
            <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <input
                id="app-method"
                name="verification-method"
                type="radio"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="app-method" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Aplikasi Autentikator (Google Authenticator, Authy, dll.)
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
