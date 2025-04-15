import React from "react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface PurchaseCounts {
  total: number;
  thisMonth: number;
  lastMonth: number;
  pending: number;
}

interface PurchaseSummaryCardsProps {
  purchaseCounts: PurchaseCounts;
}

export const PurchaseSummaryCards: React.FC<PurchaseSummaryCardsProps> = ({
  purchaseCounts,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        title="Total Pembelian"
        value={purchaseCounts.total.toString()}
        icon={<CheckCircleIcon className="h-5 w-5" />}
        colorScheme="emerald"
      />
      <SummaryCard
        title="Pembelian Bulan Ini"
        value={purchaseCounts.thisMonth.toString()}
        icon={<ExclamationCircleIcon className="h-5 w-5" />}
        colorScheme="amber"
      />
      <SummaryCard
        title="Pembelian Tertunda"
        value={purchaseCounts.pending.toString()}
        icon={<XCircleIcon className="h-5 w-5" />}
        colorScheme="rose"
      />
    </div>
  );
};
