import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PurchaseFormHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold tracking-tight">
        Tambah Pembelian Baru
      </CardTitle>
      <CardDescription>
        Catat transaksi pembelian baru dengan mengisi detail di bawah ini.
      </CardDescription>
    </CardHeader>
  );
};

export default PurchaseFormHeader;
