"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Pencil,
  Trash,
  User,
  Smartphone,
  FileText,
  Clock,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";
import { Service, ServiceStatus, DeviceType } from "../types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteService } from "@/actions/services";

interface ServiceDetailPageProps {
  service: Service;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ service }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Function to get device type label
  const getDeviceTypeLabel = (type: DeviceType) => {
    switch (type) {
      case DeviceType.LAPTOP:
        return "Laptop";
      case DeviceType.DESKTOP:
        return "Desktop";
      case DeviceType.PHONE:
        return "Smartphone";
      case DeviceType.TABLET:
        return "Tablet";
      case DeviceType.PRINTER:
        return "Printer";
      case DeviceType.OTHER:
        return "Lainnya";
      default:
        return "Tidak Diketahui";
    }
  };

  // Function to get status badge
  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.PENDING:
        return (
          <Badge variant="default" className="bg-blue-500">
            <Clock className="h-3 w-3 mr-1" />
            Masuk
          </Badge>
        );
      case ServiceStatus.IN_PROGRESS:
        return (
          <Badge variant="default" className="bg-amber-500">
            <Clock className="h-3 w-3 mr-1" />
            Diproses
          </Badge>
        );
      case ServiceStatus.WAITING_FOR_PARTS:
        return (
          <Badge variant="default" className="bg-purple-500">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu Sparepart
          </Badge>
        );
      case ServiceStatus.COMPLETED:
        return (
          <Badge variant="default" className="bg-green-500">
            <Clock className="h-3 w-3 mr-1" />
            Selesai
          </Badge>
        );
      case ServiceStatus.DELIVERED:
        return (
          <Badge variant="default" className="bg-green-700">
            <Clock className="h-3 w-3 mr-1" />
            Diambil
          </Badge>
        );
      case ServiceStatus.CANCELLED:
        return (
          <Badge variant="default" className="bg-red-500">
            <Clock className="h-3 w-3 mr-1" />
            Dibatalkan
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="bg-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            Tidak Diketahui
          </Badge>
        );
    }
  };

  // Handle delete service
  const handleDeleteService = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteService(service.id);
      if (result.success) {
        toast.success(result.success);
        router.push("/dashboard/services/management");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Terjadi kesalahan saat menghapus servis.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Detail Servis</h1>
            <p className="text-muted-foreground">
              Informasi lengkap tentang servis {service.serviceNumber}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild className="gap-2 cursor-pointer">
              <Link
                href="/dashboard/services/management"
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2 cursor-pointer">
              <Link
                href={`/dashboard/services/management/${service.id}/edit`}
                className="cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="gap-2 cursor-pointer"
                  disabled={isDeleting}
                >
                  <Trash className="h-4 w-4" />
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus servis ini? Tindakan ini
                    tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteService}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? "Menghapus..." : "Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4 cursor-pointer">
            <TabsTrigger value="details" className="cursor-pointer">
              Detail Servis
            </TabsTrigger>
            <TabsTrigger value="history" className="cursor-pointer">
              Riwayat Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Informasi Servis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Nomor Servis</div>
                      <div>{service.serviceNumber}</div>

                      <div className="font-medium">Status</div>
                      <div>{getStatusBadge(service.status)}</div>

                      <div className="font-medium">Tanggal Masuk</div>
                      <div>{formatDate(service.receivedDate)}</div>

                      {service.estimatedCompletionDate && (
                        <>
                          <div className="font-medium">Estimasi Selesai</div>
                          <div>
                            {formatDate(service.estimatedCompletionDate)}
                          </div>
                        </>
                      )}

                      {service.completedDate && (
                        <>
                          <div className="font-medium">Tanggal Selesai</div>
                          <div>{formatDate(service.completedDate)}</div>
                        </>
                      )}

                      {service.deliveredDate && (
                        <>
                          <div className="font-medium">Tanggal Diambil</div>
                          <div>{formatDate(service.deliveredDate)}</div>
                        </>
                      )}

                      {service.estimatedCost !== undefined && (
                        <>
                          <div className="font-medium">Estimasi Biaya</div>
                          <div>
                            Rp {service.estimatedCost.toLocaleString("id-ID")}
                          </div>
                        </>
                      )}

                      {service.finalCost !== undefined && (
                        <>
                          <div className="font-medium">Biaya Akhir</div>
                          <div>
                            Rp {service.finalCost.toLocaleString("id-ID")}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informasi Pelanggan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Nama</div>
                      <div>{service.customerName}</div>

                      <div className="font-medium">Telepon</div>
                      <div>{service.customerPhone}</div>

                      {service.customerEmail && (
                        <>
                          <div className="font-medium">Email</div>
                          <div>{service.customerEmail}</div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Device Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Informasi Perangkat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Tipe</div>
                      <div>{getDeviceTypeLabel(service.deviceType)}</div>

                      <div className="font-medium">Merek</div>
                      <div>{service.deviceBrand}</div>

                      <div className="font-medium">Model</div>
                      <div>{service.deviceModel}</div>

                      {service.deviceSerialNumber && (
                        <>
                          <div className="font-medium">Nomor Seri</div>
                          <div>{service.deviceSerialNumber}</div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Problem Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Deskripsi Masalah
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="whitespace-pre-wrap">
                      {service.problemDescription}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Diagnosis Notes */}
              {service.diagnosisNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Catatan Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="whitespace-pre-wrap">
                        {service.diagnosisNotes}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Repair Notes */}
              {service.repairNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Catatan Perbaikan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="whitespace-pre-wrap">
                        {service.repairNotes}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Status Servis</CardTitle>
                <CardDescription>
                  Perubahan status servis dari waktu ke waktu
                </CardDescription>
              </CardHeader>
              <CardContent>
                {service.serviceHistory && service.serviceHistory.length > 0 ? (
                  <div className="space-y-4">
                    {service.serviceHistory
                      .sort(
                        (a, b) =>
                          new Date(b.changedAt).getTime() -
                          new Date(a.changedAt).getTime()
                      )
                      .map((history) => (
                        <div
                          key={history.id}
                          className="border-b pb-4 last:border-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {getStatusBadge(history.status)}
                              </div>
                              {history.notes && (
                                <p className="text-sm mt-1">{history.notes}</p>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(history.changedAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p>Tidak ada riwayat status.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ServiceDetailPage;
