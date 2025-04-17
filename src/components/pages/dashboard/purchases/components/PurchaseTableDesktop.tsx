import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Purchase, ColumnVisibility } from "../types"; // Import from the types file
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePurchase } from "@/actions/purchases";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PurchaseTableDesktopProps {
  purchases: Purchase[];
  columnVisibility: ColumnVisibility;
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => React.ReactNode;
  searchTerm: string;
}

export const PurchaseTableDesktop: React.FC<PurchaseTableDesktopProps> = ({
  purchases,
  columnVisibility,
  handleSort,
  getSortIcon,
  searchTerm,
}) => {
  const router = useRouter();
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete purchase
  const handleDeletePurchase = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deletePurchase(id);
      if (result.success) {
        toast.success(result.success);
        // Refresh the page to show updated data
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
      toast.error("Terjadi kesalahan saat menghapus pembelian.");
    } finally {
      setIsDeleting(false);
      setPurchaseToDelete(null);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="relative overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            {columnVisibility.id && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  ID Pembelian
                  {getSortIcon("id")}
                </div>
              </th>
            )}
            {columnVisibility.date && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("purchaseDate")}
              >
                <div className="flex items-center">
                  Tanggal
                  {getSortIcon("purchaseDate")}
                </div>
              </th>
            )}
            {columnVisibility.supplier && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("supplier")}
              >
                <div className="flex items-center">
                  Supplier
                  {getSortIcon("supplier")}
                </div>
              </th>
            )}
            {columnVisibility.totalAmount && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("totalAmount")}
              >
                <div className="flex items-center">
                  Total
                  {getSortIcon("totalAmount")}
                </div>
              </th>
            )}
            {columnVisibility.invoiceRef && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("invoiceRef")}
              >
                <div className="flex items-center">
                  No. Faktur
                  {getSortIcon("invoiceRef")}
                </div>
              </th>
            )}
            {columnVisibility.itemCount && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("itemCount")}
              >
                <div className="flex items-center">
                  Jumlah Item
                  {getSortIcon("itemCount")}
                </div>
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-right">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <tr
                key={purchase.id}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {columnVisibility.id && (
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {purchase.id.substring(0, 8)}
                  </td>
                )}
                {columnVisibility.date && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {formatDate(purchase.purchaseDate)}
                  </td>
                )}
                {columnVisibility.supplier && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {purchase.supplier?.name || "-"}
                  </td>
                )}
                {columnVisibility.totalAmount && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    Rp {purchase.totalAmount.toLocaleString("id-ID")}
                  </td>
                )}
                {columnVisibility.invoiceRef && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {purchase.invoiceRef || "-"}
                  </td>
                )}
                {columnVisibility.itemCount && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {purchase.items.length}
                  </td>
                )}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex justify-end space-x-1">
                    <Link href={`/dashboard/purchases/${purchase.id}`} passHref>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/purchases/${purchase.id}/edit`}
                      passHref
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pembelian ini?
                            Tindakan ini tidak dapat dibatalkan dan akan
                            mengurangi stok produk.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              setPurchaseToDelete(purchase.id);
                              handleDeletePurchase(purchase.id);
                            }}
                            disabled={
                              isDeleting && purchaseToDelete === purchase.id
                            }
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isDeleting && purchaseToDelete === purchase.id
                              ? "Menghapus..."
                              : "Hapus"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  Object.values(columnVisibility).filter(Boolean).length + 1
                }
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                {searchTerm
                  ? "Tidak ada pembelian yang sesuai dengan pencarian."
                  : "Belum ada data pembelian."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
