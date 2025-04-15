import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SaleFormHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold tracking-tight">
        Tambah Penjualan Baru
      </CardTitle>
      <CardDescription>
        Catat transaksi penjualan baru dengan mengisi detail di bawah ini.
      </CardDescription>
    </CardHeader>
  );
};

export default SaleFormHeader;
