"use client";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useState, FormEvent } from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { useRouter } from "next/navigation";

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number | string;
  stock: number | string;
  imageUrl: string;
}

const AddProductPage: NextPage = () => {
  const router = useRouter();
  const initialFormData: ProductFormData = {
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  };
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const price = parseFloat(String(formData.price));
    const stock = parseInt(String(formData.stock), 10);

    if (isNaN(price) || price < 0) {
      setError("Harga produk tidak valid.");
      setIsLoading(false);
      return;
    }
    if (isNaN(stock) || stock < 0) {
      setError("Jumlah stok tidak valid.");
      setIsLoading(false);
      return;
    }

    const productDataToSend = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: price,
      stock: stock,
      imageUrl: formData.imageUrl || null,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/products");
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "Terjadi kesalahan saat menyimpan produk.");
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Tambah Produk Baru">
      <Head>
        <title>Tambah Produk - Kasir Online</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Card Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Informasi Produk Baru
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Tambahkan detail produk baru untuk ditambahkan ke inventaris
                Anda
              </p>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Nama Produk */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan nama produk"
                />
              </div>

              {/* Kategori */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white"
                >
                  <option value="" disabled>
                    Pilih kategori
                  </option>
                  <option value="Minuman">Minuman</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Roti">Roti</option>
                  <option value="Cemilan">Cemilan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Harga */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Harga Jual (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Stok */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stok Awal <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  required
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="0"
                />
              </div>

              {/* Image URL */}
              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL Gambar (Opsional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deskripsi (Opsional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
                  placeholder="Deskripsi singkat tentang produk..."
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
              <Link href="/dashboard/products">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Produk"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProductPage;
