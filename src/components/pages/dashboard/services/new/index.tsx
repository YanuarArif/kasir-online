"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addService } from "@/actions/services";

import DashboardLayout from "@/components/layout/dashboardlayout";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { EnhancedServiceSchema } from "./types";
import { ServiceFormValues } from "./types";
import CombinedServiceForm from "./components/CombinedServiceForm";
import { ArrowLeft, Check } from "lucide-react";
import { DeviceType } from "../types";
import EnhancedServiceFormSummary from "./components/EnhancedServiceFormSummary";

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
        // Show loading toast
        const toastId = toast.loading("Menyimpan data servis...");

        // Send the data to the server
        const result = await addService(values);

        // Dismiss the loading toast
        toast.dismiss(toastId);

        if (result.success) {
          // Show success message
          toast.success(result.success);

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
    <DashboardLayout>
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
                <CombinedServiceForm
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
                <EnhancedServiceFormSummary
                  formValues={formValues}
                  isPending={isPending}
                  onReset={() => {
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
                  }}
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
