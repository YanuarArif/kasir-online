"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription";
import { SubscriptionPlan } from "@prisma/client";

interface SubscriptionPlansProps {
  currentPlan?: SubscriptionPlan;
  expiryDate?: Date | null;
}

export default function SubscriptionPlans({ currentPlan = "FREE", expiryDate }: SubscriptionPlansProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Tidak ada";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };
  
  // Handle subscription upgrade
  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan === currentPlan) {
      return;
    }
    
    setIsLoading(plan);
    
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }
      
      if (plan === "FREE") {
        toast.success("Berhasil beralih ke paket Gratis");
        router.refresh();
      } else if (data.invoiceUrl) {
        // Redirect to Xendit payment page
        window.location.href = data.invoiceUrl;
      } else {
        toast.success(`Berhasil berlangganan paket ${SUBSCRIPTION_PLANS[plan].name}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Gagal berlangganan. Silakan coba lagi.");
    } finally {
      setIsLoading(null);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(SUBSCRIPTION_PLANS).map(([planKey, plan]) => {
        const isPlanActive = currentPlan === planKey;
        
        return (
          <Card 
            key={planKey}
            className={`flex flex-col ${
              isPlanActive 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 transition-colors"
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                {isPlanActive && (
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    Aktif
                  </Badge>
                )}
              </div>
              <CardDescription>
                {plan.price > 0 ? (
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-sm text-muted-foreground"> {plan.period}</span>
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className="text-2xl font-bold">Gratis</span>
                    <span className="text-sm text-muted-foreground"> {plan.period}</span>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={isPlanActive ? "outline" : "default"}
                className="w-full"
                disabled={isPlanActive || isLoading !== null}
                onClick={() => handleSubscribe(planKey as SubscriptionPlan)}
              >
                {isLoading === planKey ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : isPlanActive ? (
                  "Paket Saat Ini"
                ) : (
                  `Pilih Paket ${plan.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
      
      {currentPlan !== "FREE" && expiryDate && (
        <div className="col-span-full mt-4">
          <p className="text-sm text-muted-foreground">
            Langganan Anda akan berakhir pada: <span className="font-medium">{formatDate(expiryDate)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
