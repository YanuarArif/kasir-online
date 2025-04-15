import React from "react";

interface PurchaseTotalSectionProps {
  totalAmount: number;
}

const PurchaseTotalSection: React.FC<PurchaseTotalSectionProps> = ({
  totalAmount,
}) => {
  return (
    <div className="flex justify-end items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
      <span className="font-medium text-gray-700 dark:text-gray-300">
        Total:
      </span>
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Rp {totalAmount.toLocaleString("id-ID")}
      </span>
    </div>
  );
};

export default PurchaseTotalSection;
