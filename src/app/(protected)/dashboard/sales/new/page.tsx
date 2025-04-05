import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import NewSalePage from "@/components/pages/dashboard/sales/new";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// This is an async Server Component
const NewSale = async () => {
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
      stock: {
        gt: 0, // Only show products with stock > 0
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Convert Decimal to number for serialization
  const serializedProducts = products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
  }));

  return (
    <DashboardLayout pageTitle="Tambah Penjualan Baru">
      <Head>
        <title>Tambah Penjualan - Kasir Online</title>
      </Head>

      <NewSalePage products={serializedProducts} />
    </DashboardLayout>
  );
};

export default NewSale;
