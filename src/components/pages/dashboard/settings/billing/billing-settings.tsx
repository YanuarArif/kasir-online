"use client";

import { useState } from "react";
import { CreditCardIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function BillingSettings() {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Gratis",
      price: "Rp 0",
      period: "selamanya",
      description: "Untuk pengguna individu dan bisnis kecil",
      features: [
        "Maksimal 100 produk",
        "Maksimal 50 transaksi per bulan",
        "Laporan dasar",
        "1 pengguna",
      ],
      current: currentPlan === "free",
    },
    {
      id: "basic",
      name: "Dasar",
      price: "Rp 99.000",
      period: "per bulan",
      description: "Untuk bisnis kecil hingga menengah",
      features: [
        "Produk tidak terbatas",
        "Transaksi tidak terbatas",
        "Laporan lanjutan",
        "3 pengguna",
        "Dukungan prioritas",
      ],
      current: currentPlan === "basic",
    },
    {
      id: "pro",
      name: "Pro",
      price: "Rp 199.000",
      period: "per bulan",
      description: "Untuk bisnis menengah hingga besar",
      features: [
        "Semua fitur paket Dasar",
        "10 pengguna",
        "Integrasi dengan sistem lain",
        "Dukungan premium 24/7",
        "Fitur analitik lanjutan",
      ],
      current: currentPlan === "pro",
    },
  ];

  const handleUpgrade = (planId: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(planId);
      setShowSuccess(true);
      setIsLoading(false);
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <CreditCardIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Tagihan & Langganan
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Kelola langganan dan metode pembayaran Anda
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Current Plan */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Paket Langganan Saat Ini
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Anda saat ini menggunakan paket {plans.find(p => p.id === currentPlan)?.name}
          </p>
          
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                  {plans.find(p => p.id === currentPlan)?.name}
                </h4>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                  {plans.find(p => p.id === currentPlan)?.price} {plans.find(p => p.id === currentPlan)?.period}
                </p>
              </div>
              
              {currentPlan === "free" && (
                <button
                  type="button"
                  className="mt-4 md:mt-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                  onClick={() => handleUpgrade("basic")}
                >
                  Upgrade Sekarang
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Pilih Paket Langganan
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pilih paket yang sesuai dengan kebutuhan bisnis Anda
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                  plan.current
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 bg-white dark:bg-gray-800"
                }`}
              >
                {plan.current && (
                  <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium text-white bg-indigo-600 dark:bg-indigo-500 rounded-full">
                    Aktif
                  </div>
                )}
                
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {plan.name}
                </h4>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{plan.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400"> {plan.period}</span>
                </div>
                
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
                
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  type="button"
                  disabled={plan.current || isLoading}
                  onClick={() => handleUpgrade(plan.id)}
                  className={`mt-6 w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    plan.current
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600"
                  }`}
                >
                  {plan.current ? "Paket Saat Ini" : "Pilih Paket"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Metode Pembayaran
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola metode pembayaran Anda
          </p>
          
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
            <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Segera Hadir</h4>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              Fitur pembayaran online akan segera tersedia. Saat ini, silakan hubungi tim dukungan kami untuk informasi pembayaran.
            </p>
          </div>
        </div>

        {/* Billing History */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Riwayat Tagihan
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lihat riwayat tagihan dan unduh faktur Anda
          </p>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Belum ada riwayat tagihan.
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {showSuccess && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 animate-fade-in">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-300">
                Paket langganan berhasil diperbarui!
              </p>
            </div>
          </div>
        )}

        {showError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 animate-fade-in">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
              <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-300">
                Terjadi kesalahan saat memperbarui langganan.
              </p>
            </div>
          </div>
        )}
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
