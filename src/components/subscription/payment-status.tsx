"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

// Define our own PaymentStatus type to avoid conflicts
type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "EXPIRED"
  | "REFUNDED";

interface PaymentStatusProps {
  paymentId: string;
  status?: PaymentStatus;
  redirectUrl?: string;
}

export default function PaymentStatus({
  paymentId,
  status: initialStatus,
  redirectUrl = "/dashboard/settings/billing",
}: PaymentStatusProps) {
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus | undefined>(
    initialStatus
  );
  const [isLoading, setIsLoading] = useState(!initialStatus);
  const [isPolling, setIsPolling] = useState(false);

  // Check payment status
  const checkPaymentStatus = async () => {
    try {
      setIsPolling(true);
      const response = await fetch(`/api/payments/check/${paymentId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const data = await response.json();
      setStatus(data.status);

      return data.status;
    } catch (error) {
      console.error("Error checking payment status:", error);
      return null;
    } finally {
      setIsPolling(false);
    }
  };

  // Poll for payment status updates
  useEffect(() => {
    if (!paymentId) return;

    // Initial check
    const initialCheck = async () => {
      setIsLoading(true);
      await checkPaymentStatus();
      setIsLoading(false);
    };

    initialCheck();

    // Set up polling if payment is pending
    if (status === "PENDING") {
      const interval = setInterval(async () => {
        const newStatus = await checkPaymentStatus();

        // Stop polling if payment is no longer pending
        if (newStatus && newStatus !== "PENDING") {
          clearInterval(interval);

          // Show toast based on status
          if (newStatus === "COMPLETED") {
            toast.success("Pembayaran berhasil!");
          } else if (newStatus === "FAILED") {
            toast.error("Pembayaran gagal.");
          } else if (newStatus === "EXPIRED") {
            toast.error("Pembayaran kedaluwarsa.");
          }
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }

    return undefined;
  }, [paymentId, status]);

  // Render based on payment status
  const renderStatusContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-medium">
            Memeriksa status pembayaran...
          </h3>
          <p className="text-muted-foreground mt-2">Mohon tunggu sebentar</p>
        </div>
      );
    }

    switch (status) {
      case "COMPLETED":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-medium">Pembayaran Berhasil!</h3>
            <p className="text-muted-foreground mt-2">
              Terima kasih atas pembayaran Anda. Langganan Anda telah
              diaktifkan.
            </p>
          </div>
        );
      case "FAILED":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-medium">Pembayaran Gagal</h3>
            <p className="text-muted-foreground mt-2">
              Maaf, pembayaran Anda gagal diproses. Silakan coba lagi.
            </p>
          </div>
        );
      case "EXPIRED":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
            <h3 className="text-xl font-medium">Pembayaran Kedaluwarsa</h3>
            <p className="text-muted-foreground mt-2">
              Waktu pembayaran telah habis. Silakan coba lagi dengan memilih
              paket langganan.
            </p>
          </div>
        );
      case "PENDING":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
              {isPolling && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                </div>
              )}
            </div>
            <h3 className="text-xl font-medium">Menunggu Pembayaran</h3>
            <p className="text-muted-foreground mt-2 text-center">
              Pembayaran Anda sedang diproses. Halaman ini akan diperbarui
              secara otomatis.
              <br />
              Jika Anda telah melakukan pembayaran, silakan klik tombol "Periksa
              Status" di bawah.
            </p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Status Tidak Diketahui</h3>
            <p className="text-muted-foreground mt-2">
              Tidak dapat menentukan status pembayaran Anda. Silakan hubungi
              dukungan.
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Status Pembayaran</CardTitle>
        <CardDescription>
          Informasi status pembayaran langganan Anda
        </CardDescription>
      </CardHeader>
      <CardContent>{renderStatusContent()}</CardContent>
      <CardFooter className="flex justify-center gap-4">
        {status === "PENDING" && (
          <Button
            variant="outline"
            onClick={checkPaymentStatus}
            disabled={isPolling}
          >
            {isPolling ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memeriksa...
              </>
            ) : (
              "Periksa Status"
            )}
          </Button>
        )}
        <Button onClick={() => router.push(redirectUrl)}>
          {status === "COMPLETED" ? "Lihat Langganan" : "Kembali"}
        </Button>
      </CardFooter>
    </Card>
  );
}
