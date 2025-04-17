import React from "react";
import { notFound } from "next/navigation";
import ServiceEditPage from "@/components/pages/dashboard/services/edit";
import { getServiceById } from "@/lib/get-services";

type Props = {
  params: Promise<{ id: string }>;
};

// This is an async Server Component
export default async function EditService(props: Props) {
  // Get the id from params (which is now a Promise)
  const params = await props.params;
  const id = params.id;

  // Fetch the service with the given ID
  const service = await getServiceById(id);

  // If service not found, return 404
  if (!service) {
    notFound();
  }

  return <ServiceEditPage service={service} />;
}
