"use client";

import { useState } from "react";
import { BuildingStorefrontIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function BusinessSettings() {
  // Business Information
  const [businessName, setBusinessName] = useState("Toko Saya");
  const [businessType, setBusinessType] = useState("retail");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  
  // Tax Settings
  const [enableTax, setEnableTax] = useState(false);
  const [taxRate, setTaxRate] = useState("10");
  const [taxNumber, setTaxNumber] = useState("");
  
  // Receipt Settings
  const [receiptHeader, setReceiptHeader] = useState("");
  const [receiptFooter, setReceiptFooter] = useState("Terima kasih telah berbelanja!");
  const [showLogo, setShowLogo] = useState(true);
  
  // Status
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
        <BuildingStorefrontIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Pengaturan Bisnis
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Kelola informasi bisnis dan pengaturan toko Anda
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Informasi Bisnis
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Informasi dasar tentang bisnis Anda
          </p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
            <div className="space-y-2">
              <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nama Bisnis
              </label>
              <input
                type="text"
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Nama bisnis Anda"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="business-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Jenis Bisnis
              </label>
              <select
                id="business-type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
              >
                <option value="retail">Retail</option>
                <option value="food">Makanan & Minuman</option>
                <option value="service">Jasa</option>
                <option value="wholesale">Grosir</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="business-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Alamat Bisnis
              </label>
              <textarea
                id="business-address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Alamat lengkap bisnis Anda"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="business-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nomor Telepon
              </label>
              <input
                type="tel"
                id="business-phone"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Nomor telepon bisnis"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="business-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Bisnis
              </label>
              <input
                type="email"
                id="business-email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Email bisnis"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="business-website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website
              </label>
              <input
                type="url"
                id="business-website"
                value={businessWebsite}
                onChange={(e) => setBusinessWebsite(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Pengaturan Pajak
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Atur pengaturan pajak untuk transaksi Anda
          </p>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktifkan Pajak</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Terapkan pajak pada transaksi penjualan
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={enableTax}
                  onChange={() => setEnableTax(!enableTax)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            {enableTax && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4 pl-4 border-l-2 border-indigo-100 dark:border-indigo-800/30">
                <div className="space-y-2">
                  <label htmlFor="tax-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tarif Pajak (%)
                  </label>
                  <input
                    type="number"
                    id="tax-rate"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="tax-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    NPWP / Nomor Pajak
                  </label>
                  <input
                    type="text"
                    id="tax-number"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                    placeholder="Nomor NPWP"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Receipt Settings */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Pengaturan Struk
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sesuaikan tampilan struk penjualan Anda
          </p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="receipt-header" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Header Struk
              </label>
              <textarea
                id="receipt-header"
                value={receiptHeader}
                onChange={(e) => setReceiptHeader(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Teks yang akan muncul di bagian atas struk"
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="receipt-footer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Footer Struk
              </label>
              <textarea
                id="receipt-footer"
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Teks yang akan muncul di bagian bawah struk"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 sm:col-span-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tampilkan Logo</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Tampilkan logo bisnis di struk
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={showLogo}
                  onChange={() => setShowLogo(!showLogo)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {showSuccess && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 animate-fade-in">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-300">
                Pengaturan bisnis berhasil disimpan!
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
