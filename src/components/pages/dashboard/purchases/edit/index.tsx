"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updatePurchase } from "@/actions/purchases";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  PurchaseFormValues,
  Product,
  Supplier,
  EnhancedPurchaseSchema,
} from "../new/types";
import PurchaseFormTabs from "../new/components/PurchaseFormTabs";
import PurchaseTransactionSummary from "../new/components/PurchaseTransactionSummary";
import { ArrowLeft, Check } from "lucide-react";

// Define the Purchase interface
interface PurchaseItem {
  id: string;
  quantity: number;
  costAtPurchase: number;
  productId: string;
  product: Product;
}

interface Purchase {
  id: string;
  totalAmount: number;
  invoiceRef: string | null;
  purchaseDate: string;
  supplierId: string | null;
  items: PurchaseItem[];
}

// Props use imported types
interface EnhancedPurchaseEditPageProps {
  purchase: Purchase;
  products: Product[];
  suppliers: Supplier[];
}

const EnhancedPurchaseEditPage: React.FC<EnhancedPurchaseEditPageProps> = ({
  purchase,
  products,
  suppliers,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [totalAmount, setTotalAmount] = useState<number>(purchase.totalAmount);

  // Initialize the form with enhanced schema and purchase data
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(EnhancedPurchaseSchema),
    defaultValues: {
      items: purchase.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        costAtPurchase: item.costAtPurchase
      })),
      totalAmount: purchase.totalAmount,
      invoiceRef: purchase.invoiceRef || "",
      supplierId: purchase.supplierId || "",
      paymentStatus: "paid",
      trackDelivery: false,
      notifyOnArrival: false,
    },
  });

  // Get the items field array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch for changes in the items array to calculate the total
  const items = form.watch("items");
  const formValues = form.watch();

  // Calculate total amount whenever items change
  useEffect(() => {
    const total = items.reduce(
      (sum: number, item: PurchaseFormValues["items"][number]) => {
        // Ensure item and properties exist before calculation
        const quantity = item?.quantity ?? 0;
        const cost = item?.costAtPurchase ?? 0;
        return sum + quantity * cost;
      },
      0
    );
    setTotalAmount(total);
    form.setValue("totalAmount", total);
  }, [items, form]);

  // Handle product selection
  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct: Product | undefined = products.find(
      (p) => p.id === productId
    );
    // Check if selectedProduct exists and its cost is a number
    if (selectedProduct && typeof selectedProduct.cost === "number") {
      const costValue = selectedProduct.cost; // Assign to variable to help TS inference
      form.setValue(`items.${index}.costAtPurchase`, costValue);

      // Force recalculation of total immediately
      const currentItems = form.getValues("items");

      // Ensure the item exists before trying to update it
      if (currentItems[index]) {
        currentItems[index].costAtPurchase = selectedProduct.cost;
      }

      const total = currentItems.reduce(
        (sum: number, item: PurchaseFormValues["items"][number]) => {
          // Ensure item and properties exist before calculation
          const quantity = item?.quantity ?? 0;
          const cost = item?.costAtPurchase ?? 0;
          return sum + quantity * cost;
        },
        0
      );

      setTotalAmount(total);
      form.setValue("totalAmount", total);
    }
  };

  // Handle form submission
  const onSubmit = (values: PurchaseFormValues) => {
    startTransition(async () => {
      try {
        // Extract only the fields that are in the original PurchaseSchema
        const purchaseData = {
          items: values.items,
          totalAmount: values.totalAmount,
          invoiceRef: values.invoiceRef,
          supplierId: values.supplierId,
        };

        const result = await updatePurchase(purchase.id, purchaseData);
        if (result.success) {
          toast.success(result.success);
          // Redirect after a short delay
          router.push(`/dashboard/purchases/${purchase.id}`);
        } else if (result.error) {
          toast.error(result.error);
        } else {
          toast.error("Terjadi kesalahan yang tidak diketahui.");
        }
      } catch (error) {
        console.error("Submit Error:", error);
        toast.error("Gagal menghubungi server.");
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Pembelian</h1>
          <p className="text-muted-foreground">
            Perbarui transaksi pembelian dengan mengisi detail di bawah ini
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href={`/dashboard/purchases/${purchase.id}`}>
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Content */}
            <div className="lg:col-span-2">
              <PurchaseFormTabs
                control={form.control}
                isPending={isPending}
                products={products}
                suppliers={suppliers}
                items={items}
                fields={fields}
                append={append}
                remove={remove}
                handleProductChange={handleProductChange}
                totalAmount={totalAmount}
              />
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <PurchaseTransactionSummary
                formValues={formValues}
                totalAmount={totalAmount}
                isPending={isPending}
                itemCount={items.length}
                suppliers={suppliers}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              asChild
              disabled={isPending}
            >
              <Link href={`/dashboard/purchases/${purchase.id}`}>Batal</Link>
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnhancedPurchaseEditPage;
