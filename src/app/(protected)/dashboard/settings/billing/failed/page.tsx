import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import SettingsLayout from "@/components/pages/dashboard/settings/settings-layout";
import PaymentStatus from "@/components/subscription/payment-status";
import { PaymentStatus as PaymentStatusEnum } from "@prisma/client";

const PaymentFailedPage = async ({
  searchParams,
}: {
  searchParams: { payment_id?: string };
}) => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  
  const paymentId = searchParams.payment_id;
  
  if (!paymentId) {
    redirect("/dashboard/settings/billing");
  }

  return (
    <DashboardLayout pageTitle="Pembayaran Gagal">
      <SettingsLayout>
        <div className="flex justify-center py-8">
          <PaymentStatus 
            paymentId={paymentId} 
            status={PaymentStatusEnum.FAILED}
            redirectUrl="/dashboard/settings/billing"
          />
        </div>
      </SettingsLayout>
    </DashboardLayout>
  );
};

export default PaymentFailedPage;
