"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Judul */}
        <h1 className="text-9xl font-extrabold tracking-widest animate-bounce-slow">
          404
        </h1>

        {/* Pesan */}
        <p className="text-2xl md:text-3xl font-semibold">
          Oops! Halaman ini hilang di galaksi.
        </p>
        <p className="text-lg md:text-xl opacity-80">
          Mungkin tersesat di lubang hitam atau belum pernah ada.
        </p>

        {/* Tombol Kembali */}
        <Link href="/">
          <button className="mt-6 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-indigo-100 transition-all duration-300 cursor-pointer">
            Kembali ke Bumi
          </button>
        </Link>

        {/* Elemen Dekoratif */}
        <div className="mt-12 flex justify-center gap-4">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
          <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-200" />
          <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-400" />
        </div>
      </div>

      {/* CSS Kustom */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
