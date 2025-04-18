"use client";

import React, { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateService } from "@/actions/services";
import { EnhancedServiceSchema } from "../new/types";
import { ServiceFormValues } from "../new/types";
import ServiceFormTabs from "../new/components/ServiceFormTabs";
import { ArrowLeft, Check } from "lucide-react";
import ServiceFormSummary from "../new/components/ServiceFormSummary";
import { Service } from "../types";

interface ServiceEditPageProps {
  service: Service;
}

const ServiceEditPage: React.FC<ServiceEditPageProps> = ({ service }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // Initialize the form with enhanced schema and service data
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(EnhancedServiceSchema),
    defaultValues: {
      serviceNumber: service.serviceNumber,
      customerName: service.customerName,
      customerPhone: service.customerPhone,
      customerEmail: service.customerEmail || "",
      deviceType: service.deviceType,
      deviceBrand: service.deviceBrand,
      deviceModel: service.deviceModel,
      deviceSerialNumber: service.deviceSerialNumber || "",
      problemDescription: service.problemDescription,
      estimatedCost: service.estimatedCost || 0,
      estimatedCompletionDate: service.estimatedCompletionDate
        ? service.estimatedCompletionDate.split("T")[0]
        : "",
      diagnosisNotes: service.diagnosisNotes || "",
      repairNotes: service.repairNotes || "",
      customerAddress: "",
      warrantyPeriod: 0,
      priorityLevel: "MEDIUM",
      customerId: service.customerId || "",
      attachments: [],
    },
  });

  const handleAttachmentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // This is a placeholder for actual file upload
      // In a real implementation, you would upload the file to a storage service
      // and get back a URL
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const fakeUrl = `https://example.com/uploads/${file.name}`;

      setAttachments((prev) => [...prev, fakeUrl]);

      // Reset the file input
      setFileInputKey(Date.now());

      toast.success("File berhasil diunggah!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Gagal mengunggah file.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: ServiceFormValues) => {
    startTransition(async () => {
      try {
        // Extract only the fields that are in the original ServiceSchema
        const serviceData = {
          serviceNumber: values.serviceNumber,
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          customerEmail: values.customerEmail,
          deviceType: values.deviceType,
          deviceBrand: values.deviceBrand,
          deviceModel: values.deviceModel,
          deviceSerialNumber: values.deviceSerialNumber,
          problemDescription: values.problemDescription,
          estimatedCost: values.estimatedCost,
          estimatedCompletionDate: values.estimatedCompletionDate,
        };

        const result = await updateService(service.id, serviceData);
        if (result.success) {
          toast.success(result.success);
          // Redirect to service detail page
          router.push(`/dashboard/services/management/${service.id}`);
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
            <h1 className="text-2xl font-bold">Edit Servis</h1>
            <p className="text-muted-foreground">
              Edit informasi servis {service.serviceNumber}
            </p>
          </div>
          <Button variant="outline" asChild className="gap-2 cursor-pointer">
            <Link
              href={`/dashboard/services/management/${service.id}`}
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

                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={isPending}
                  >
                    <Check className="h-4 w-4" />
                    {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default ServiceEditPage;
