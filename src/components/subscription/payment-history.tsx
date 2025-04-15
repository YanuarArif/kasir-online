"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLinkIcon, RefreshCwIcon } from "lucide-react";
import { PaymentStatus } from "@prisma/client";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  externalUrl: string | null;
  paymentDate: Date | null;
  expiryDate: Date | null;
  createdAt: Date;
  subscription: {
    id: string;
    plan: string;
  } | null;
}

export default function PaymentHistory() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  
  // Format currency
  const formatCurrency = (amount: number, currency = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy, HH:mm", { locale: id });
  };
  
  // Get payment status badge
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500">Lunas</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Menunggu Pembayaran</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Gagal</Badge>;
      case "EXPIRED":
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Kedaluwarsa</Badge>;
      case "REFUNDED":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Dikembalikan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Fetch payment history
  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/payments");
      
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }
      
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Gagal memuat riwayat pembayaran");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check payment status
  const checkPaymentStatus = async (paymentId: string) => {
    try {
      setRefreshingId(paymentId);
      const response = await fetch(`/api/payments/check/${paymentId}`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }
      
      const data = await response.json();
      
      // If status changed, refresh the list
      if (data.status) {
        fetchPayments();
        
        // If payment is completed, refresh the page to update subscription status
        if (data.status === "COMPLETED") {
          toast.success("Pembayaran berhasil dikonfirmasi!");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast.error("Gagal memeriksa status pembayaran");
    } finally {
      setRefreshingId(null);
    }
  };
  
  // Load payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Pembayaran</CardTitle>
        <CardDescription>
          Daftar semua pembayaran langganan Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada riwayat pembayaran
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Bayar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const planName = payment.subscription
                    ? SUBSCRIPTION_PLANS[payment.subscription.plan as keyof typeof SUBSCRIPTION_PLANS]?.name
                    : "Unknown";
                    
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      <TableCell>{planName}</TableCell>
                      <TableCell>{formatCurrency(Number(payment.amount), payment.currency)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {payment.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => checkPaymentStatus(payment.id)}
                              disabled={refreshingId === payment.id}
                            >
                              {refreshingId === payment.id ? (
                                <RefreshCwIcon className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCwIcon className="h-4 w-4" />
                              )}
                              <span className="sr-only">Refresh</span>
                            </Button>
                          )}
                          
                          {payment.externalUrl && payment.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(payment.externalUrl!, "_blank")}
                            >
                              <ExternalLinkIcon className="h-4 w-4 mr-1" />
                              Bayar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
