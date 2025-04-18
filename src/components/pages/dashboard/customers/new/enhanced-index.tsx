"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

// Import components and types
import { EnhancedCustomerFormValues, EnhancedCustomerSchema } from "./types";
import { CustomerInfoSection } from "./components/CustomerInfoSection";
import { ContactInfoSection } from "./components/ContactInfoSection";
import { AddressSection } from "./components/AddressSection";
import { NotesSection } from "./components/NotesSection";

// Import actions
import { addCustomer } from "@/actions/customers";

export default function EnhancedNewCustomerPage() {
  const router = useRouter();

  // Initialize form with default values
  const form = useForm<EnhancedCustomerFormValues>({
    resolver: zodResolver(EnhancedCustomerSchema),
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      NIK: "",
      NPWP: "",
      category: "regular",
    },
  });

  // Handle form submission
  const onSubmit = async (data: EnhancedCustomerFormValues) => {
    try {
      // Show loading toast with ID so we can dismiss it later
      const toastId = toast.loading("Menyimpan data pelanggan...");

      // Submit the form data
      const result = await addCustomer(data);

      // Dismiss the loading toast
      toast.dismiss(toastId);

      // Handle the result
      if (result.success) {
        toast.success("Pelanggan berhasil ditambahkan!");
        router.push("/dashboard/customers");
      } else {
        toast.error(result.error || "Gagal menambahkan pelanggan");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      // Dismiss any loading toasts in case of error
      toast.dismiss();
      toast.error("Terjadi kesalahan saat menambahkan pelanggan");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Tambah Pelanggan Baru
          </h2>
          <p className="text-sm text-muted-foreground">
            Isi formulir berikut untuk menambahkan pelanggan baru
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Data Pelanggan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <CustomerInfoSection form={form} />
                <ContactInfoSection form={form} />
              </CardContent>
            </Card>

            {/* Address and Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Tambahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <AddressSection form={form} />
                <NotesSection form={form} />
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/customers")}
            >
              Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              Simpan Pelanggan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
