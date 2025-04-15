import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PurchaseFormActionsProps {
  isPending: boolean;
  onCancel: () => void; // Use router.back() or a custom handler
}

const PurchaseFormActions: React.FC<PurchaseFormActionsProps> = ({
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
        {isPending ? "Menyimpan..." : "Simpan Pembelian"}
      </Button>
    </div>
  );
};

export default PurchaseFormActions;
