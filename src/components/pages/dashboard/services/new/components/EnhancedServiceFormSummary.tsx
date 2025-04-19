"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceFormValues, priorityLevelOptions } from "../types";
import { formatDate } from "@/lib/utils";
import { DeviceType, ServiceStatus } from "../../types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Printer,
  RotateCcw,
  Clock,
  Calendar,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  User,
  Paperclip,
  ClipboardList,
} from "lucide-react";
import { useForm } from "react-hook-form";

interface EnhancedServiceFormSummaryProps {
  formValues: ServiceFormValues;
  isPending: boolean;
  onReset?: () => void;
}

const EnhancedServiceFormSummary: React.FC<EnhancedServiceFormSummaryProps> = ({
  formValues,
  isPending,
  onReset,
}) => {
  // Format device type for display
  const getDeviceTypeLabel = (type: DeviceType) => {
    switch (type) {
      case DeviceType.LAPTOP:
        return "Laptop";
      case DeviceType.DESKTOP:
        return "Desktop PC";
      case DeviceType.PHONE:
        return "Smartphone";
      case DeviceType.TABLET:
        return "Tablet";
      case DeviceType.PRINTER:
        return "Printer";
      case DeviceType.OTHER:
        return "Lainnya";
      default:
        return type;
    }
  };

  // Format priority level for display
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "Rendah";
      case "MEDIUM":
        return "Sedang";
      case "HIGH":
        return "Tinggi";
      default:
        return priority;
    }
  };

  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "LOW":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
          >
            Rendah
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            Sedang
          </Badge>
        );
      case "HIGH":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          >
            Tinggi
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate estimated completion time
  const getEstimatedTimeRemaining = () => {
    if (!formValues.estimatedCompletionDate) return null;

    const today = new Date();
    const estimatedDate = new Date(formValues.estimatedCompletionDate);
    const diffTime = estimatedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Sudah lewat tenggat";
    } else if (diffDays === 0) {
      return "Hari ini";
    } else if (diffDays === 1) {
      return "Besok";
    } else {
      return `${diffDays} hari lagi`;
    }
  };

  // Get service status badge
  const getStatusBadge = (status: ServiceStatus = ServiceStatus.PENDING) => {
    switch (status) {
      case ServiceStatus.PENDING:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        );
      case ServiceStatus.IN_PROGRESS:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <Clock className="h-3 w-3 mr-1" />
            Dalam Proses
          </Badge>
        );
      case ServiceStatus.WAITING_FOR_PARTS:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Menunggu Sparepart
          </Badge>
        );
      case ServiceStatus.COMPLETED:
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Selesai
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate form completion percentage
  const calculateCompletionPercentage = () => {
    const requiredFields = [
      "customerName",
      "customerPhone",
      "deviceBrand",
      "deviceModel",
      "problemDescription",
    ];

    const optionalFields = [
      "customerEmail",
      "deviceSerialNumber",
      "estimatedCost",
      "estimatedCompletionDate",
      "diagnosisNotes",
      "repairNotes",
      "customerAddress",
      "warrantyPeriod",
    ];

    let filledRequired = 0;
    requiredFields.forEach((field) => {
      if (formValues[field as keyof ServiceFormValues]) filledRequired++;
    });

    let filledOptional = 0;
    optionalFields.forEach((field) => {
      if (formValues[field as keyof ServiceFormValues]) filledOptional++;
    });

    // Required fields count more toward completion
    const requiredWeight = 0.7;
    const optionalWeight = 0.3;

    const requiredPercentage =
      (filledRequired / requiredFields.length) * requiredWeight;
    const optionalPercentage =
      (filledOptional / optionalFields.length) * optionalWeight;

    return Math.round((requiredPercentage + optionalPercentage) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  return (
    <Card className="sticky top-4">
      <CardHeader className="bg-gray-100 dark:bg-gray-800 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Ringkasan Servis</CardTitle>
          {getStatusBadge()}
        </div>

        {/* Form Completion Progress */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Kelengkapan Form</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Service Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Informasi Servis
              </h3>
            </div>
            <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1">
                  <ClipboardList className="h-3.5 w-3.5 text-purple-500" />
                  Nomor Servis
                </span>
                <span className="text-sm font-medium">
                  {formValues.serviceNumber}
                </span>
              </div>
              {formValues.estimatedCompletionDate && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      Estimasi Selesai
                    </span>
                    <span className="text-sm font-medium">
                      {formatDate(formValues.estimatedCompletionDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-orange-500" />
                      Sisa Waktu
                    </span>
                    <span className="text-sm font-medium">
                      {getEstimatedTimeRemaining()}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                  Prioritas
                </span>
                <div>
                  {getPriorityBadge(formValues.priorityLevel || "MEDIUM")}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-green-500" />
                  Estimasi Biaya
                </span>
                <span className="text-sm font-medium">
                  {formValues.estimatedCost && formValues.estimatedCost > 0
                    ? formatCurrency(formValues.estimatedCost)
                    : "Belum ditentukan"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-blue-500" />
                  Garansi
                </span>
                <span className="text-sm font-medium">
                  {formValues.warrantyPeriod && formValues.warrantyPeriod > 0
                    ? `${formValues.warrantyPeriod} hari`
                    : "Tidak ada garansi"}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {formValues.customerName && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Informasi Pelanggan
                </h3>
              </div>
              <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm">Nama</span>
                  <span className="text-sm font-medium">
                    {formValues.customerName}
                  </span>
                </div>
                {formValues.customerPhone && (
                  <div className="flex justify-between">
                    <span className="text-sm">Telepon</span>
                    <span className="text-sm font-medium">
                      {formValues.customerPhone}
                    </span>
                  </div>
                )}
                {formValues.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-sm">Email</span>
                    <span className="text-sm font-medium">
                      {formValues.customerEmail}
                    </span>
                  </div>
                )}
                {formValues.customerAddress && (
                  <div className="flex justify-between">
                    <span className="text-sm">Alamat</span>
                    <span className="text-sm font-medium">
                      {formValues.customerAddress.length > 20
                        ? `${formValues.customerAddress.substring(0, 20)}...`
                        : formValues.customerAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Device Info */}
          {formValues.deviceBrand && formValues.deviceModel && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Informasi Perangkat
                </h3>
              </div>
              <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm">Tipe</span>
                  <span className="text-sm font-medium">
                    {getDeviceTypeLabel(formValues.deviceType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Merek</span>
                  <span className="text-sm font-medium">
                    {formValues.deviceBrand}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Model</span>
                  <span className="text-sm font-medium">
                    {formValues.deviceModel}
                  </span>
                </div>
                {formValues.deviceSerialNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm">Nomor Seri</span>
                    <span className="text-sm font-medium">
                      {formValues.deviceSerialNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Problem Description */}
          {formValues.problemDescription && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Deskripsi Masalah
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {formValues.problemDescription.length > 100
                    ? `${formValues.problemDescription.substring(0, 100)}...`
                    : formValues.problemDescription}
                </p>
              </div>
            </div>
          )}

          {/* Repair Notes */}
          {formValues.repairNotes && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Catatan Perbaikan
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {formValues.repairNotes.length > 100
                    ? `${formValues.repairNotes.substring(0, 100)}...`
                    : formValues.repairNotes}
                </p>
              </div>
            </div>
          )}

          {/* Attachments */}
          {formValues.attachments && formValues.attachments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Paperclip className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Lampiran
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Jumlah File</span>
                  <Badge variant="outline">
                    {formValues.attachments.length} file
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled={isPending}
            >
              <Printer className="h-4 w-4 mr-2" />
              Cetak Formulir Servis
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled={isPending}
            >
              <FileText className="h-4 w-4 mr-2" />
              Pratinjau Dokumen
            </Button>
            {onReset && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={onReset}
                disabled={isPending}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Form
              </Button>
            )}
          </div>

          {/* Status */}
          <div className="pt-2">
            <Badge
              variant={isPending ? "secondary" : "default"}
              className="w-full justify-center py-1"
            >
              {isPending ? "Menyimpan..." : "Siap Disimpan"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedServiceFormSummary;
