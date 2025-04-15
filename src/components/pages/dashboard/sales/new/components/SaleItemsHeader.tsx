import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";

interface SaleItemsHeaderProps {
  onAddItem: () => void;
  isPending: boolean;
}

const SaleItemsHeader: React.FC<SaleItemsHeaderProps> = ({
  onAddItem,
  isPending,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Item Penjualan
      </h3>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddItem}
        disabled={isPending}
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Tambah Item
      </Button>
    </div>
  );
};

export default SaleItemsHeader;
