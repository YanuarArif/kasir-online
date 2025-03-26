// pages/index.tsx
"use client";

import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const HalamanDepan: NextPage = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <Head>
        <title>Project Kasir Online - Solusi POS Modern</title>
        <meta
          name="description"
          content="Project Kasir Online - Solusi Point of Sale modern Anda"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Project Kasir Online
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Sederhanakan bisnis Anda dengan solusi Point of Sale berbasis
              cloud kami.
            </p>
            <div className="space-x-4">
              <Link
                href="/signup"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/features"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/dashboard-preview.png"
              alt="Dashboard Kasir Online"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mengapa Memilih Kasir Online?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Berbasis Cloud"
              description="Akses POS Anda dari mana saja, kapan saja"
              icon="☁️"
            />
            <FeatureCard
              title="Analitik Real-time"
              description="Dapatkan wawasan instan tentang bisnis Anda"
              icon="📊"
            />
            <FeatureCard
              title="Mudah Digunakan"
              description="Antarmuka intuitif untuk adopsi cepat"
              icon="👌"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Transformasi Bisnis Anda?
          </h2>
          <p className="text-gray-600 mb-8">
            Bergabunglah dengan ribuan bisnis yang menggunakan Kasir Online
            untuk menyederhanakan operasional mereka.
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Coba Gratis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Project Kasir Online. Hak cipta dilindungi.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link href="/privacy" className="hover:text-gray-300">
              Privasi
            </Link>
            <Link href="/terms" className="hover:text-gray-300">
              Ketentuan
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Kontak
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HalamanDepan;
