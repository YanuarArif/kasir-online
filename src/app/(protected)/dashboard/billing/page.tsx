import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboardlayout";
import Head from "next/head";
import BillingPage from "@/app/pages/dashboard/billing/billing";

const Billing = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout pageTitle="Tagihan">
      <Head>
        <title>Tagihan - Kasir Online</title>
      </Head>

      <BillingPage />
    </DashboardLayout>
  );
};

export default Billing;
