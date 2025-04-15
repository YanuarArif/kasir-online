import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";
import PaymentStatus from "@/components/subscription/payment-status";
import { PaymentStatus as PaymentStatusEnum } from "@prisma/client";

export default async function PaymentPendingPage(props: any) {
  const { searchParams = {} } = props;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const paymentIdParam = searchParams.payment_id;

  // Handle the case where payment_id could be a string or an array of strings
  const paymentId = Array.isArray(paymentIdParam)
    ? paymentIdParam[0]
    : paymentIdParam;

  if (!paymentId) {
    redirect("/dashboard/settings/billing");
  }

  return (
    <DashboardLayout pageTitle="Menunggu Pembayaran">
      <SettingsLayout>
        <div className="flex justify-center py-8">
          <PaymentStatus
            paymentId={paymentId}
            status={PaymentStatusEnum.PENDING}
            redirectUrl="/dashboard/settings/billing"
          />
        </div>
      </SettingsLayout>
    </DashboardLayout>
  );
}
