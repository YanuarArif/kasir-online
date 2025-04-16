import React from "react";
import { notFound } from "next/navigation";
import SaleDetailPage from "@/components/pages/dashboard/sales/detail";
import { getSaleById } from "@/actions/sales";

type Props = {
  params: Promise<{ id: string }>;
};

// This is an async Server Component
export default async function SaleDetail(props: Props) {
  // Get the id from params (which is now a Promise)
  const params = await props.params;
  const id = params.id;

  // Fetch the sale with the given ID
  const saleResult = await getSaleById(id);

  // If sale not found, return 404
  if (!saleResult.sale) {
    notFound();
  }

  return <SaleDetailPage sale={saleResult.sale} />;
}
