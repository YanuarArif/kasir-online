import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboardlayout";
import Head from "next/head";
import BillingPage from "@/components/pages/dashboard/billing/billing";
import { getUserSubscription } from "@/lib/subscription";

const Billing = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get user's subscription
  const subscription = await getUserSubscription(session.user.id);

  // Extract only the properties needed by the component
  const subscriptionData = {
    plan: subscription.plan,
    expiryDate: subscription.expiryDate
      ? subscription.expiryDate.toISOString()
      : null,
    isActive: subscription.isActive,
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Tagihan - Kasir Online</title>
      </Head>

      <BillingPage initialData={subscriptionData} />
    </DashboardLayout>
  );
};

export default Billing;
