// pages/index.tsx
"use client";

import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image"; // Import next/image
import { useState } from "react";
import {
  CloudIcon,
  ChartBarIcon,
  CheckCircleIcon, // Using CheckCircle instead of generic 'ok'
} from "@heroicons/react/24/outline"; // Import icons

const HalamanDepan: NextPage = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <Head>
        <title>Project Kasir Online - Solusi POS Modern</title>
        <meta
          name="description"
          content="Project Kasir Online - Solusi Point of Sale modern Anda yang efisien dan mudah digunakan." // Slightly improved description
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Use <main> for semantic main content */}
      <main>
        {/* Hero Section */}
        <section className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black flex items-center justify-center px-4 py-16 md:py-0">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Text Content */}
            <div className="text-white text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                Project Kasir Online
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Sederhanakan bisnis Anda dengan solusi Point of Sale berbasis
                cloud kami yang modern dan intuitif.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                {/* Primary Button */}
                <Link
                  href="/dashboard"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900" // Added focus states
                >
                  Mulai Sekarang (Gratis)
                </Link>
                {/* Secondary Button */}
                <Link
                  href="/features"
                  className="inline-block border border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900" // Added focus states
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>

            {/* Image Section */}
            {/* Use next/image for optimization and better handling */}
            <div className="relative hidden md:block aspect-video rounded-lg overflow-hidden shadow-2xl border border-gray-700">
              {/* Add a subtle glow effect if desired */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/10 opacity-50 blur-2xl"></div>
              <Image
                src="/dashboard-preview.png" // Ensure this path is correct
                alt="Pratinjau Dashboard Project Kasir Online"
                fill // Use fill to make it responsive within the container
                style={{ objectFit: "cover" }} // Or 'contain' depending on the image
                priority // Load image eagerly as it's likely above the fold
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gray-50">
          {" "}
          {/* Slightly lighter gray */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
              Mengapa Memilih Kasir Online?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              {/* Updated FeatureCard usage with Heroicons */}
              <FeatureCard
                title="Berbasis Cloud"
                description="Akses data penjualan dan inventaris Anda dari mana saja, kapan saja, dengan aman."
                icon={<CloudIcon className="w-12 h-12 text-blue-600" />} // Pass icon component
              />
              <FeatureCard
                title="Analitik Real-time"
                description="Dapatkan wawasan bisnis instan melalui laporan yang mudah dipahami."
                icon={<ChartBarIcon className="w-12 h-12 text-blue-600" />}
              />
              <FeatureCard
                title="Mudah Digunakan"
                description="Antarmuka pengguna yang bersih dan intuitif, dirancang untuk efisiensi."
                icon={<CheckCircleIcon className="w-12 h-12 text-blue-600" />}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5">
              Siap Transformasi Bisnis Anda?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Bergabunglah dengan ribuan bisnis yang menggunakan Kasir Online
              untuk menyederhanakan operasional dan meningkatkan profitabilitas.
            </p>
            {/* Improved Email Form Layout */}
            <form
              className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault(); // Handle form submission properly
                alert(`Email submitted: ${email}`); // Replace with actual logic
              }}
            >
              <label htmlFor="cta-email" className="sr-only">
                {" "}
                {/* Label for accessibility */}
                Alamat Email
              </label>
              <input
                id="cta-email" // Connect label and input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan alamat email Anda"
                required // Add basic validation
                className="flex-grow px-5 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full"
                aria-label="Alamat Email untuk memulai coba gratis"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap" // Added focus states and whitespace-nowrap
              >
                Coba Gratis Sekarang
              </button>
            </form>
          </div>
        </section>
      </main>{" "}
      {/* End of main content */}
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-10 px-4">
        {" "}
        {/* Increased padding */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Project Kasir Online. Hak cipta
            dilindungi undang-undang.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-sm hover:text-white transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/terms"
              className="text-sm hover:text-white transition-colors"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              href="/contact"
              className="text-sm hover:text-white transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

// Feature Card Component - Adjusted for better styling and icon handling
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode; // Accept ReactNode for icons
}

// Use const for standard functional components
const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    // Added subtle hover effect and border
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out text-center border border-gray-200">
      {/* Icon container */}
      <div className="flex justify-center items-center mb-5 w-16 h-16 mx-auto bg-blue-100 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default HalamanDepan;
