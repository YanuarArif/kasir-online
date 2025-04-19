"use client";

import React from "react";
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
import { Separator } from "@/components/ui/separator";

interface CombinedServiceFormProps {
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

const CombinedServiceForm: React.FC<CombinedServiceFormProps> = ({
  control,
  isPending,
  handleAttachmentUpload,
  isUploading,
  attachments,
  fileInputRef,
  fileInputKey,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulir Servis Baru</CardTitle>
        <CardDescription>
          Lengkapi semua informasi untuk membuat servis baru
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Customer Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Informasi Pelanggan</h3>
          </div>
          <CustomerInfoSection control={control} isPending={isPending} />
        </div>

        <Separator />

        {/* Device Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Informasi Perangkat</h3>
          </div>
          <DeviceInfoSection control={control} isPending={isPending} />
        </div>

        <Separator />

        {/* Service Options Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Opsi Servis</h3>
          </div>
          <ServiceOptionsSection control={control} isPending={isPending} />
        </div>

        <Separator />

        {/* Problem Details Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Detail Masalah</h3>
          </div>
          <ProblemDetailsSection control={control} isPending={isPending} />
        </div>

        <Separator />

        {/* Attachments Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Paperclip className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Lampiran</h3>
          </div>
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
  );
};

export default CombinedServiceForm;
