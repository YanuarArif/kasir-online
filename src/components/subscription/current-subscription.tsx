"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, CreditCard } from "lucide-react";
import { SubscriptionPlan } from "@prisma/client";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription";

interface CurrentSubscriptionProps {
  initialData?: {
    plan: SubscriptionPlan;
    expiryDate: string | null;
    isActive: boolean;
  };
}

export default function CurrentSubscription({ initialData }: CurrentSubscriptionProps) {
  const router = useRouter();
  const [subscription, setSubscription] = useState(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tidak ada";
    return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
  };
  
  // Fetch subscription data if not provided
  const fetchSubscription = async () => {
    if (initialData) return;
    
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscriptions");
      
      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }
      
      const data = await response.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load subscription on component mount if not provided
  useEffect(() => {
    fetchSubscription();
  }, [initialData]);
  
  // If loading or no subscription data
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Langganan Saat Ini</CardTitle>
          <CardDescription>
            Informasi langganan dan status pembayaran Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Langganan Saat Ini</CardTitle>
          <CardDescription>
            Informasi langganan dan status pembayaran Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span>Tidak dapat memuat informasi langganan</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const planDetails = SUBSCRIPTION_PLANS[subscription.plan];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <CardTitle>Langganan Saat Ini</CardTitle>
        </div>
        <CardDescription>
          Informasi langganan dan status pembayaran Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-primary/5 rounded-lg p-4 flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-2">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">
                Paket {planDetails.name}
              </h3>
              {subscription.isActive ? (
                <Badge variant="default" className="bg-green-500">
                  Aktif
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-500 text-red-500">
                  Tidak Aktif
                </Badge>
              )}
            </div>
            
            {planDetails.price > 0 ? (
              <p className="text-sm text-muted-foreground mt-1">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(planDetails.price)}{" "}
                / {planDetails.period}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Gratis {planDetails.period}
              </p>
            )}
            
            {subscription.expiryDate && (
              <p className="text-xs text-muted-foreground mt-2">
                Aktif hingga: {formatDate(subscription.expiryDate)}
              </p>
            )}
            
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/settings/billing")}
              >
                Kelola Langganan
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
