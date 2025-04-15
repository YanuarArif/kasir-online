import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SaleFormActionsProps {
  isPending: boolean;
  onCancel: () => void;
}

const SaleFormActions: React.FC<SaleFormActionsProps> = ({
  isPending,
  onCancel,
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        Batal
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan Penjualan"}
      </Button>
    </div>
  );
};

export default SaleFormActions;
