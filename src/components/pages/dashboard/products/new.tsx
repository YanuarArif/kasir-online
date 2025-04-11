"use client";

import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner"; // Assuming sonner is set up
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadProductImage } from "@/actions/upload";

import DashboardLayout from "@/components/layout/dashboardlayout";
import { ProductSchema } from "@/schemas/zod";
import { addProduct } from "@/actions/products";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this component
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Using Card for structure

type ProductFormValues = z.infer<typeof ProductSchema>;

const AddProductPage: NextPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [fileInputKey, setFileInputKey] = React.useState<number>(0); // Add a key to force re-render
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: 0, // Use 0 instead of undefined to ensure it's always controlled
      cost: 0, // Use 0 instead of undefined
      stock: 0, // Use 0 instead of undefined
      image: "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL for the selected image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload the image to Vercel Blob
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadProductImage(formData);

      if (result.success && result.url) {
        setImageUrl(result.url);
        form.setValue("image", result.url);
        toast.success("Gambar berhasil diunggah");
      } else {
        toast.error(result.error || "Gagal mengunggah gambar");
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: ProductFormValues) => {
    startTransition(async () => {
      try {
        const result = await addProduct(values);
        if (result.success) {
          toast.success(result.success);
          // Reset form and state
          form.reset({
            name: "",
            description: "",
            sku: "",
            price: 0,
            cost: 0,
            stock: 0,
            image: "",
          });
          setImageUrl("");
          setPreviewUrl("");
          // Reset file input by incrementing the key
          setFileInputKey((prev) => prev + 1);
          // Redirect to products page
          router.push("/dashboard/products");
        } else if (result.error) {
          toast.error(result.error);
        } else {
          toast.error("Terjadi kesalahan yang tidak diketahui.");
        }
      } catch (error) {
        console.error("Submit Error:", error);
        toast.error("Gagal menghubungi server.");
      }
    });
  };

  return (
    <DashboardLayout pageTitle="Tambah Produk Baru">
      <Head>
        <title>Tambah Produk - Kasir Online</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Informasi Produk Baru
            </CardTitle>
            <CardDescription>
              Tambahkan detail produk baru untuk ditambahkan ke inventaris Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Nama Produk */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>
                          Nama Produk <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nama produk"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SKU */}
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: BRG001"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Harga Jual */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Harga Jual (Rp){" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          {/* Use type="number" but handle potential string values if needed */}
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            min="0"
                            step="any"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Harga Beli */}
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Beli (Rp) (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            min="0"
                            step="any"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Stok Awal */}
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Stok Awal <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            min="0"
                            step="1"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Deskripsi */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Deskripsi (Opsional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Deskripsi singkat tentang produk..."
                            className="resize-y"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Gambar Produk (Opsional)</FormLabel>
                        <div className="flex flex-col space-y-4">
                          {/* Hidden field for the image URL */}
                          <input type="hidden" {...field} />

                          {/* File input for image upload */}
                          <div className="flex items-center gap-4">
                            <FormControl>
                              <Input
                                key={fileInputKey} // Use key to force re-render
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                                disabled={isPending || isUploading}
                                className="max-w-md"
                              />
                            </FormControl>
                            {isUploading && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Mengunggah...
                              </span>
                            )}
                          </div>

                          {/* Image preview */}
                          {previewUrl && (
                            <div className="mt-2 relative w-48 h-48 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800">
                              <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                style={{ objectFit: "contain" }}
                              />
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    disabled={isPending}
                  >
                    <Link href="/dashboard/products">Batal</Link>
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Menyimpan..." : "Simpan Produk"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddProductPage;
