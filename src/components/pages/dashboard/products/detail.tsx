"use client";

import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import DashboardLayout from "@/components/layout/dashboardlayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  cost: number | null;
  stock: number;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  category: Category | null;
}

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
  const router = useRouter();

  return (
    <DashboardLayout pageTitle="Detail Produk">
      <Head>
        <title>{product.name} - Kasir Online</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {product.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="flex justify-center items-start">
                {product.image ? (
                  <div className="relative w-full h-64 border rounded-md overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="bg-white"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 border rounded-md flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Tidak ada gambar</p>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Informasi Dasar</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">SKU</div>
                    <div>{product.sku || "-"}</div>
                    
                    <div className="font-medium">Harga Jual</div>
                    <div>Rp {product.price.toLocaleString("id-ID")}</div>
                    
                    <div className="font-medium">Harga Beli</div>
                    <div>
                      {product.cost
                        ? `Rp ${product.cost.toLocaleString("id-ID")}`
                        : "-"}
                    </div>
                    
                    <div className="font-medium">Stok</div>
                    <div className={product.stock <= 0 ? "text-red-600" : ""}>
                      {product.stock > 0 ? product.stock : "Habis"}
                    </div>
                    
                    <div className="font-medium">Kategori</div>
                    <div>{product.category?.name || "-"}</div>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Deskripsi</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                    <div>Dibuat pada</div>
                    <div>
                      {new Date(product.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    
                    <div>Terakhir diperbarui</div>
                    <div>
                      {new Date(product.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-4">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      Edit Produk
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProductDetailPage;
