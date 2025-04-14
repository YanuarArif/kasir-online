import React from "react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface StockCounts {
  available: number;
  low: number;
  outOfStock: number;
  needsApproval: number; // Keep for potential future use if needed by parent
}

interface StockSummaryCardsProps {
  stockCounts: StockCounts;
}

export const StockSummaryCards: React.FC<StockSummaryCardsProps> = ({
  stockCounts,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        title="Stok Tersedia"
        value={stockCounts.available.toString()}
        icon={<CheckCircleIcon className="h-5 w-5" />}
        colorScheme="emerald"
      />
      <SummaryCard
        title="Stok Segera Habis"
        value={stockCounts.low.toString()}
        icon={<ExclamationCircleIcon className="h-5 w-5" />}
        colorScheme="amber"
      />
      <SummaryCard
        title="Stok Habis"
        value={stockCounts.outOfStock.toString()}
        icon={<XCircleIcon className="h-5 w-5" />}
        colorScheme="rose"
      />
    </div>
  );
};
