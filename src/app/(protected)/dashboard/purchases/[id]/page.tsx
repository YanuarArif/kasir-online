import React from "react";
import { notFound } from "next/navigation";
import PurchaseDetailPage from "@/components/pages/dashboard/purchases/detail";
import { getPurchaseById } from "@/actions/purchases";

type Props = {
  params: Promise<{ id: string }>;
};

// This is an async Server Component
export default async function PurchaseDetail(props: Props) {
  // Get the id from params (which is now a Promise)
  const params = await props.params;
  const id = params.id;

  // Fetch the purchase with the given ID
  const purchaseResult = await getPurchaseById(id);

  // If purchase not found, return 404
  if (!purchaseResult.purchase) {
    notFound();
  }

  return <PurchaseDetailPage purchase={purchaseResult.purchase} />;
}
