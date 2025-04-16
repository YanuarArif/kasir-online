"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Smartphone, FileText, Paperclip } from "lucide-react";
import { ServiceFormValues } from "../types";
import { Control } from "react-hook-form";
import CustomerInfoSection from "./CustomerInfoSection";
import DeviceInfoSection from "./DeviceInfoSection";
import ProblemDetailsSection from "./ProblemDetailsSection";
import ServiceOptionsSection from "./ServiceOptionsSection";
import AttachmentsSection from "./AttachmentsSection";

interface ServiceFormTabsProps {
  control: Control<ServiceFormValues>;
  isPending: boolean;
  handleAttachmentUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  isUploading: boolean;
  attachments: string[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputKey: number;
}

const ServiceFormTabs: React.FC<ServiceFormTabsProps> = ({
  control,
  isPending,
  handleAttachmentUpload,
  isUploading,
  attachments,
  fileInputRef,
  fileInputKey,
}) => {
  return (
    <Tabs defaultValue="customer" className="w-full">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="customer" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Informasi Pelanggan</span>
            <span className="sm:hidden">Pelanggan</span>
          </TabsTrigger>
          <TabsTrigger value="device" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Informasi Perangkat</span>
            <span className="sm:hidden">Perangkat</span>
          </TabsTrigger>
          <TabsTrigger value="problem" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Detail & Lampiran</span>
            <span className="sm:hidden">Detail</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="customer" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pelanggan</CardTitle>
            <CardDescription>
              Masukkan informasi pelanggan yang meminta servis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerInfoSection control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="device" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Perangkat</CardTitle>
            <CardDescription>
              Masukkan detail perangkat yang akan diservis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceInfoSection control={control} isPending={isPending} />
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-4">Opsi Servis</h3>
              <ServiceOptionsSection control={control} isPending={isPending} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="problem" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Detail Masalah & Lampiran</CardTitle>
            <CardDescription>
              Jelaskan masalah yang dialami perangkat dan tambahkan lampiran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProblemDetailsSection control={control} isPending={isPending} />

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-4">Lampiran</h3>
              <AttachmentsSection
                control={control}
                isPending={isPending}
                handleAttachmentUpload={handleAttachmentUpload}
                isUploading={isUploading}
                attachments={attachments}
                fileInputRef={fileInputRef}
                fileInputKey={fileInputKey}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ServiceFormTabs;
