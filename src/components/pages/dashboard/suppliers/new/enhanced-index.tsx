"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addSupplier } from "@/actions/suppliers";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SupplierFormValues, EnhancedSupplierSchema } from "./types";
import SupplierFormTabs from "./components/SupplierFormTabs";
import { ArrowLeft, Check } from "lucide-react";
import SupplierSummary from "./components/SupplierSummary";

const EnhancedSupplierPage: React.FC = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Initialize the form with enhanced schema
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(EnhancedSupplierSchema),
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      website: "",
      taxId: "",
      paymentTerms: "",
      supplierType: "product",
      isActive: true,
      rating: 0,
      socialMedia: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
      },
      bankInfo: {
        bankName: "",
        accountNumber: "",
        accountName: "",
      },
      tags: [],
    },
  });

  // Watch form values for the summary component
  const formValues = form.watch();

  // Handle form submission
  const onSubmit = (values: SupplierFormValues) => {
    startTransition(async () => {
      // Show loading toast with ID so we can dismiss it later
      const toastId = toast.loading("Menyimpan data supplier...");

      try {
        // Extract only the fields that are in the original SupplierSchema
        const supplierData = {
          name: values.name,
          contactName: values.contactName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          notes: values.notes,
        };

        const result = await addSupplier(supplierData);

        // Dismiss the loading toast
        toast.dismiss(toastId);

        if (result.success) {
          toast.success(result.success);
          form.reset(); // Reset form on success
          // Redirect after a short delay
          router.push("/dashboard/suppliers");
        } else if (result.error) {
          toast.error(result.error);
        } else {
          toast.error("Terjadi kesalahan yang tidak diketahui.");
        }
      } catch (error) {
        // Dismiss any loading toasts in case of error
        toast.dismiss();
        console.error("Submit Error:", error);
        toast.error("Gagal menghubungi server.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link href="/dashboard/suppliers">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Supplier
          </Link>
        </Button>
        <Button
          type="submit"
          form="supplier-form"
          disabled={isPending}
          className="gap-1"
        >
          <Check className="h-4 w-4" />
          {isPending ? "Menyimpan..." : "Simpan Supplier"}
        </Button>
      </div>

      <Form {...form}>
        <form id="supplier-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Content */}
            <div className="lg:col-span-2">
              <SupplierFormTabs control={form.control} isPending={isPending} />
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <SupplierSummary formValues={formValues} isPending={isPending} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnhancedSupplierPage;
