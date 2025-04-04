import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import NewPurchasePage from "@/app/pages/dashboard/purchases/new";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// This is an async Server Component
const NewPurchase = async () => {
  // Get current session
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error("User ID not found in session on protected route.");
    return <p>Error: User tidak ditemukan.</p>;
  }

  // Fetch products for the current user to populate the dropdown
  const products = await db.product.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      cost: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Fetch suppliers for the current user
  const suppliers = await db.supplier.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Convert Decimal to number for serialization
  const serializedProducts = products.map((product) => ({
    ...product,
    cost: product.cost ? product.cost.toNumber() : null,
  }));

  return (
    <DashboardLayout pageTitle="Tambah Pembelian Baru">
      <Head>
        <title>Tambah Pembelian - Kasir Online</title>
      </Head>

      <NewPurchasePage products={serializedProducts} suppliers={suppliers} />
    </DashboardLayout>
  );
};

export default NewPurchase;
