"use client";

import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import {
  ArrowLeft,
  Trash,
  Edit,
  Package,
  Tag,
  Layers,
  Info,
  Box,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/dashboardlayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/actions/products";

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
  barcode?: string;
  taxRate?: number;
  hasVariants?: boolean;
  trackInventory?: boolean;
  minStockLevel?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  tags?: string[];
}

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Handle delete product
  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (result.success) {
        toast.success(result.success);
        router.push("/dashboard/products");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Terjadi kesalahan saat menghapus produk.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate profit if both price and cost are available
  const profit =
    product.price && product.cost ? product.price - product.cost : null;
  const profitPercentage =
    profit && product.cost ? (profit / product.cost) * 100 : null;

  // Determine stock status
  const getStockStatus = () => {
    if (product.stock <= 0) return { label: "Habis", color: "destructive" };
    if (product.minStockLevel && product.stock <= product.minStockLevel)
      return { label: "Stok Rendah", color: "warning" };
    return { label: "Tersedia", color: "success" };
  };

  const stockStatus = getStockStatus();

  return (
    <DashboardLayout>
      <Head>
        <title>{product.name} - Kasir Online</title>
      </Head>

      <div className="container mx-auto px-4 py-6">
        {/* Header with back button and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">Detail informasi produk</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="gap-2">
              <Link href={`/dashboard/products/${product.id}/edit`}>
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash className="h-4 w-4" />
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus produk{" "}
                    <span className="font-semibold">{product.name}</span>?
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteProduct}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? "Menghapus..." : "Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Image and summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Image Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Gambar Produk</CardTitle>
              </CardHeader>
              <CardContent>
                {product.image ? (
                  <div className="relative w-full h-64 rounded-md overflow-hidden">
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
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ringkasan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stock Status */}
                <div>
                  <p className="text-sm font-medium mb-1">Status Stok</p>
                  <Badge
                    variant={
                      stockStatus.color === "warning"
                        ? "outline"
                        : stockStatus.color === "success"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {stockStatus.label}
                  </Badge>
                </div>

                {/* Price Info */}
                <div>
                  <p className="text-sm font-medium mb-1">Harga Jual</p>
                  <p className="text-2xl font-bold">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Cost and Profit */}
                {product.cost !== null && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Harga Beli</p>
                      <p className="text-lg">
                        Rp {product.cost.toLocaleString("id-ID")}
                      </p>
                    </div>
                    {profit !== null && (
                      <div>
                        <p className="text-sm font-medium mb-1">Keuntungan</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg">
                            Rp {profit.toLocaleString("id-ID")}
                          </p>
                          {profitPercentage !== null && (
                            <Badge variant="outline" className="text-green-600">
                              +{profitPercentage.toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stock Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Stok Saat Ini</p>
                    <p className="text-lg">{product.stock}</p>
                  </div>
                  {product.minStockLevel !== undefined && (
                    <div>
                      <p className="text-sm font-medium mb-1">Stok Minimum</p>
                      <p className="text-lg">{product.minStockLevel}</p>
                    </div>
                  )}
                </div>

                {/* Category */}
                {product.category && (
                  <div>
                    <p className="text-sm font-medium mb-1">Kategori</p>
                    <Badge variant="secondary">{product.category.name}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column - Tabs with details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger
                  value="details"
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  <span>Detail</span>
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="flex items-center gap-2"
                >
                  <Layers className="h-4 w-4" />
                  <span>Inventaris</span>
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="flex items-center gap-2"
                >
                  <Box className="h-4 w-4" />
                  <span>Pengiriman</span>
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Nama Produk
                        </p>
                        <p>{product.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          SKU
                        </p>
                        <p>{product.sku || "-"}</p>
                      </div>
                      {product.barcode && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Barcode
                          </p>
                          <p>{product.barcode}</p>
                        </div>
                      )}
                      {product.taxRate !== undefined && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Pajak
                          </p>
                          <p>{product.taxRate}%</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Deskripsi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.description ? (
                      <p className="whitespace-pre-line">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Tidak ada deskripsi
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Tags Card */}
                {product.tags && product.tags.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Tag</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Manajemen Stok</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Stok Saat Ini
                        </p>
                        <p
                          className={
                            product.stock <= 0 ? "text-red-600 font-medium" : ""
                          }
                        >
                          {product.stock > 0 ? product.stock : "Habis"}
                        </p>
                      </div>
                      {product.minStockLevel !== undefined && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Stok Minimum
                          </p>
                          <p>{product.minStockLevel}</p>
                        </div>
                      )}
                      {product.trackInventory !== undefined && (
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Lacak Inventaris
                          </p>
                          <p>{product.trackInventory ? "Ya" : "Tidak"}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Variants Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Varian Produk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.hasVariants ? (
                      <p>Produk ini memiliki varian.</p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Produk ini tidak memiliki varian
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Shipping Tab */}
              <TabsContent value="shipping" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Informasi Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-4">
                      {product.weight !== undefined && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Berat
                          </p>
                          <p>{product.weight} gram</p>
                        </div>
                      )}
                      {product.dimensions && (
                        <>
                          {product.dimensions.length !== undefined && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Panjang
                              </p>
                              <p>{product.dimensions.length} cm</p>
                            </div>
                          )}
                          {product.dimensions.width !== undefined && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Lebar
                              </p>
                              <p>{product.dimensions.width} cm</p>
                            </div>
                          )}
                          {product.dimensions.height !== undefined && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Tinggi
                              </p>
                              <p>{product.dimensions.height} cm</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Dibuat:</span>
              <span>
                {new Date(product.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Diperbarui:</span>
              <span>
                {new Date(product.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductDetailPage;
