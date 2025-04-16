import React from "react";
import { CustomerStatus } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";

interface CustomerStatusCardsProps {
  customerStatus: CustomerStatus;
}

export const CustomerStatusCards: React.FC<CustomerStatusCardsProps> = ({
  customerStatus,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customerStatus.total}</div>
          <p className="text-xs text-muted-foreground">
            Jumlah seluruh pelanggan yang terdaftar
          </p>
        </CardContent>
      </Card>

      {/* Active Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pelanggan Aktif</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customerStatus.active}</div>
          <p className="text-xs text-muted-foreground">
            Pelanggan yang aktif bertransaksi
          </p>
        </CardContent>
      </Card>

      {/* Inactive Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pelanggan Tidak Aktif</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customerStatus.inactive}</div>
          <p className="text-xs text-muted-foreground">
            Pelanggan yang tidak aktif bertransaksi
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
