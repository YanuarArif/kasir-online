"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/dashboardlayout";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { EnhancedServiceSchema } from "./types";
import { ServiceFormValues } from "./types";
import ServiceFormTabs from "./components/ServiceFormTabs";
import { ArrowLeft, Check } from "lucide-react";
import { DeviceType } from "../types";
import ServiceFormSummary from "./components/ServiceFormSummary";

const AddServicePage: React.FC = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [fileInputKey, setFileInputKey] = React.useState<number>(0);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Generate a service number
  const generateServiceNumber = () => {
    const prefix = "SRV";
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${dateStr}-${randomNum}`;
  };

  // Initialize the form with enhanced schema
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(EnhancedServiceSchema),
    defaultValues: {
      serviceNumber: generateServiceNumber(),
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      deviceType: DeviceType.OTHER,
      deviceBrand: "",
      deviceModel: "",
      deviceSerialNumber: "",
      problemDescription: "",
      estimatedCost: 0,
      estimatedCompletionDate: "",
      diagnosisNotes: "",
      repairNotes: "",
      customerAddress: "",
      warrantyPeriod: 0,
      priorityLevel: "MEDIUM",
      customerId: "",
      attachments: [],
    },
  });

  const handleAttachmentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real implementation, you would upload the file to a storage service
    // For now, we'll just simulate the upload
    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a fake URL for the attachment
      const fakeUrl = `https://example.com/attachments/${file.name}`;

      // Update attachments state
      const newAttachments = [...attachments, fakeUrl];
      setAttachments(newAttachments);

      // Update form value
      form.setValue("attachments", newAttachments);

      toast.success("Lampiran berhasil diunggah");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Gagal mengunggah lampiran");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFileInputKey((prev) => prev + 1);
    }
  };

  const onSubmit = (values: ServiceFormValues) => {
    startTransition(async () => {
      try {
        // In a real implementation, you would send the data to the server
        // For now, we'll just simulate the submission
        console.log("Service data:", values);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Show success message
        toast.success("Servis berhasil ditambahkan");

        // Reset form and state
        form.reset({
          serviceNumber: generateServiceNumber(),
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          deviceType: DeviceType.OTHER,
          deviceBrand: "",
          deviceModel: "",
          deviceSerialNumber: "",
          problemDescription: "",
          estimatedCost: 0,
          estimatedCompletionDate: "",
          diagnosisNotes: "",
          repairNotes: "",
          customerAddress: "",
          warrantyPeriod: 0,
          priorityLevel: "MEDIUM",
          customerId: "",
          attachments: [],
        });

        setAttachments([]);

        // Redirect to services page
        router.push("/dashboard/services/management");
      } catch (error) {
        console.error("Submit Error:", error);
        toast.error("Gagal menghubungi server.");
      }
    });
  };

  // Watch form values for summary
  const formValues = form.watch();

  return (
    <DashboardLayout pageTitle="Tambah Servis Baru">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tambah Servis Baru</h1>
            <p className="text-muted-foreground">
              Tambahkan servis baru ke sistem manajemen servis Anda
            </p>
          </div>
          <Button variant="outline" asChild className="gap-2 cursor-pointer">
            <Link
              href="/dashboard/services/management"
              className="cursor-pointer"
            >
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
                <ServiceFormTabs
                  control={form.control}
                  isPending={isPending}
                  handleAttachmentUpload={handleAttachmentUpload}
                  isUploading={isUploading}
                  attachments={attachments}
                  fileInputRef={fileInputRef}
                  fileInputKey={fileInputKey}
                />
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                <ServiceFormSummary formValues={formValues} />
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
                <Link
                  href="/dashboard/services/management"
                  className="cursor-pointer"
                >
                  Batal
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Simpan Servis</span>
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

export default AddServicePage;
