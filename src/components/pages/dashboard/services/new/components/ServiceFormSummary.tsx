import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceFormValues } from "../types";
import { formatDate } from "@/lib/utils";
import { DeviceType } from "../../types";

interface ServiceFormSummaryProps {
  formValues: ServiceFormValues;
  isPending: boolean;
}

const ServiceFormSummary: React.FC<ServiceFormSummaryProps> = ({
  formValues,
  isPending,
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="bg-gray-100 dark:bg-gray-800">
        <CardTitle className="text-lg">Ringkasan Servis</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Service Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Informasi Servis
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Nomor Servis</span>
                <span className="text-sm font-medium">
                  {formValues.serviceNumber}
                </span>
              </div>
              {formValues.estimatedCompletionDate && (
                <div className="flex justify-between">
                  <span className="text-sm">Estimasi Selesai</span>
                  <span className="text-sm font-medium">
                    {formatDate(formValues.estimatedCompletionDate)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm">Prioritas</span>
                <span className="text-sm font-medium">
                  {getPriorityLabel(formValues.priorityLevel || "MEDIUM")}
                </span>
              </div>
              {formValues.estimatedCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Estimasi Biaya</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(formValues.estimatedCost)}
                  </span>
                </div>
              )}
              {formValues.warrantyPeriod > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Garansi</span>
                  <span className="text-sm font-medium">
                    {formValues.warrantyPeriod} hari
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          {formValues.customerName && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Informasi Pelanggan
              </h3>
              <div className="space-y-2">
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
              </div>
            </div>
          )}

          {/* Device Info */}
          {formValues.deviceBrand && formValues.deviceModel && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Informasi Perangkat
              </h3>
              <div className="space-y-2">
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
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Deskripsi Masalah
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {formValues.problemDescription.length > 100
                  ? `${formValues.problemDescription.substring(0, 100)}...`
                  : formValues.problemDescription}
              </p>
            </div>
          )}

          {/* Attachments */}
          {formValues.attachments && formValues.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Lampiran
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {formValues.attachments.length} file terlampir
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceFormSummary;
