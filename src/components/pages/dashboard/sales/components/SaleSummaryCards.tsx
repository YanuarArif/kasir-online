import React from "react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface SaleCounts {
  total: number;
  today: number;
  thisMonth: number;
  pending: number;
}

interface SaleSummaryCardsProps {
  saleCounts: SaleCounts;
}

export const SaleSummaryCards: React.FC<SaleSummaryCardsProps> = ({
  saleCounts,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        title="Total Penjualan"
        value={saleCounts.total.toString()}
        icon={<CheckCircleIcon className="h-5 w-5" />}
        colorScheme="emerald"
      />
      <SummaryCard
        title="Penjualan Hari Ini"
        value={saleCounts.today.toString()}
        icon={<ExclamationCircleIcon className="h-5 w-5" />}
        colorScheme="amber"
      />
      <SummaryCard
        title="Penjualan Bulan Ini"
        value={saleCounts.thisMonth.toString()}
        icon={<XCircleIcon className="h-5 w-5" />}
        colorScheme="indigo"
      />
    </div>
  );
};
