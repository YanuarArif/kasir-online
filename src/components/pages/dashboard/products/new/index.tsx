"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { uploadProductImage } from "@/actions/upload";
import { addProduct } from "@/actions/products";

import DashboardLayout from "@/components/layout/dashboardlayout";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { EnhancedProductSchema } from "./types";
import { ProductFormValues } from "./types";
import ProductFormTabs from "./components/ProductFormTabs";
import ProductFormSummary from "./components/ProductFormSummary";
import { ArrowLeft, Check } from "lucide-react";

const EnhancedAddProductPage: React.FC = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [fileInputKey, setFileInputKey] = React.useState<number>(0);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Initialize the form with enhanced schema
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(EnhancedProductSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: 0,
      cost: 0,
      stock: 0,
      image: "",
      categoryId: "",
      barcode: "",
      taxRate: 0,
      hasVariants: false,
      trackInventory: true,
      minStockLevel: 0,
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      tags: [],
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
        // Extract only the fields that are in the original ProductSchema
        const productData = {
          name: values.name,
          description: values.description,
          sku: values.sku,
          price: values.price,
          cost: values.cost,
          stock: values.stock,
          image: values.image,
        };

        const result = await addProduct(productData);
        if (result.success) {
          toast.success(result.success);
          // Reset form and state
          form.reset();
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

  // Watch form values for summary
  const formValues = form.watch();

  return (
    <DashboardLayout pageTitle="Tambah Produk Baru">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
            <p className="text-muted-foreground">
              Tambahkan produk baru ke inventaris Anda
            </p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form Content */}
              <div className="lg:col-span-2">
                <ProductFormTabs
                  control={form.control}
                  isPending={isPending}
                  handleImageUpload={handleImageUpload}
                  isUploading={isUploading}
                  previewUrl={previewUrl}
                  fileInputRef={fileInputRef}
                  fileInputKey={fileInputKey}
                />
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                <ProductFormSummary
                  formValues={formValues}
                  isPending={isPending}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                asChild
                disabled={isPending}
              >
                <Link href="/dashboard/products">Batal</Link>
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Simpan Produk</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedAddProductPage;
