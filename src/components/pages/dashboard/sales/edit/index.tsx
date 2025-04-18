"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateSale } from "@/actions/sales";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SaleFormValues, Product, EnhancedSaleSchema } from "../new/types";
import SaleFormTabs from "../new/components/SaleFormTabs";
import SaleTransactionSummary from "../new/components/SaleTransactionSummary";
import { ArrowLeft, Check } from "lucide-react";

// Define the Sale interface
interface SaleItem {
  id: string;
  quantity: number;
  priceAtSale: number;
  productId: string;
  product: Product;
}

interface Sale {
  id: string;
  totalAmount: number;
  saleDate: string;
  items: SaleItem[];
}

// Props use imported types
interface EnhancedSaleEditPageProps {
  sale: Sale;
  products: Product[];
}

const EnhancedSaleEditPage: React.FC<EnhancedSaleEditPageProps> = ({
  sale,
  products,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [totalAmount, setTotalAmount] = useState<number>(sale.totalAmount);

  // Initialize the form with enhanced schema and sale data
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(EnhancedSaleSchema),
    defaultValues: {
      items: sale.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: item.priceAtSale,
      })),
      totalAmount: sale.totalAmount,
      customerId: "default", // Default to general customer
      customerNIK: "",
      customerNPWP: "",
      paymentMethod: "cash",
      amountPaid: 0,
      notes: "",
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
      (sum: number, item: SaleFormValues["items"][number]) => {
        const quantity = item?.quantity ?? 0;
        const price = item?.priceAtSale ?? 0;
        return sum + quantity * price;
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
    // Check if selectedProduct exists and its price is a number
    if (selectedProduct && typeof selectedProduct.price === "number") {
      const priceValue = selectedProduct.price; // Assign to variable
      form.setValue(`items.${index}.priceAtSale`, priceValue);

      // Force recalculation of total immediately
      const currentItems = form.getValues("items");

      // Ensure the item exists before trying to update it
      if (currentItems[index]) {
        currentItems[index].priceAtSale = priceValue;
      }

      const total = currentItems.reduce(
        (sum: number, item: SaleFormValues["items"][number]) => {
          const quantity = item?.quantity ?? 0;
          const price = item?.priceAtSale ?? 0;
          return sum + quantity * price;
        },
        0
      );

      setTotalAmount(total);
      form.setValue("totalAmount", total);
    }
  };

  // Handle form submission
  const onSubmit = (values: SaleFormValues) => {
    startTransition(async () => {
      try {
        // Extract only the fields that are in the original SaleSchema
        const saleData = {
          items: values.items,
          totalAmount: values.totalAmount,
        };

        const result = await updateSale(sale.id, saleData);
        if (result.success) {
          toast.success(result.success);
          // Redirect after a short delay
          router.push(`/dashboard/sales/${sale.id}`);
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
          <h1 className="text-2xl font-bold">Edit Penjualan</h1>
          <p className="text-muted-foreground">
            Perbarui transaksi penjualan dengan mengisi detail di bawah ini
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href={`/dashboard/sales/${sale.id}`}>
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
              <SaleFormTabs
                control={form.control}
                isPending={isPending}
                products={products}
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
              <SaleTransactionSummary
                formValues={formValues}
                totalAmount={totalAmount}
                isPending={isPending}
                itemCount={items.length}
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
              <Link href={`/dashboard/sales/${sale.id}`}>Batal</Link>
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

export default EnhancedSaleEditPage;
