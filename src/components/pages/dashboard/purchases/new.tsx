"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PurchaseSchema } from "@/schemas/zod";
import { addPurchase } from "@/actions/purchases";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PurchaseFormValues,
  Product,
  Supplier,
} from "@/components/pages/dashboard/purchases/new/types"; // Use alias
import PurchaseFormHeader from "@/components/pages/dashboard/purchases/new/components/PurchaseFormHeader"; // Use alias
import PurchaseInfoSection from "@/components/pages/dashboard/purchases/new/components/PurchaseInfoSection"; // Use alias
import PurchaseItemsHeader from "@/components/pages/dashboard/purchases/new/components/PurchaseItemsHeader"; // Use alias
import PurchaseItemRow from "@/components/pages/dashboard/purchases/new/components/PurchaseItemRow"; // Use alias
import PurchaseTotalSection from "@/components/pages/dashboard/purchases/new/components/PurchaseTotalSection"; // Use alias
import PurchaseFormActions from "@/components/pages/dashboard/purchases/new/components/PurchaseFormActions"; // Use alias

// Props remain the same, but types are imported
interface NewPurchasePageProps {
  products: Product[];
  suppliers: Supplier[];
}

const NewPurchasePage: React.FC<NewPurchasePageProps> = ({
  products,
  suppliers,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Initialize the form
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      items: [{ productId: "", quantity: 1, costAtPurchase: 0 }],
      totalAmount: 0,
      invoiceRef: "",
      supplierId: "",
    },
  });

  // Get the items field array - keep control for passing down
  const { fields, append, remove } = useFieldArray({
    control: form.control, // Keep control
    name: "items",
  });

  // Watch for changes in the items array to calculate the total
  const items = form.watch("items");

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
        const result = await addPurchase(values);
        if (result.success) {
          toast.success(result.success);
          form.reset(); // Reset form on success
          // Redirect after a short delay
          router.push("/dashboard/purchases");
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card>
        <PurchaseFormHeader />
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Purchase Info Section */}
              <PurchaseInfoSection
                control={form.control}
                isPending={isPending}
                suppliers={suppliers}
              />

              {/* Purchase Items Section */}
              <div className="space-y-4 mt-6">
                <PurchaseItemsHeader
                  onAddItem={() =>
                    append({ productId: "", quantity: 1, costAtPurchase: 0 })
                  }
                  isPending={isPending}
                />

                {fields.map((field, index) => (
                  <PurchaseItemRow
                    key={field.id}
                    control={form.control}
                    index={index}
                    field={field}
                    products={products}
                    items={items} // Pass watched items
                    remove={remove}
                    handleProductChange={handleProductChange}
                    isPending={isPending}
                    canRemove={fields.length > 1}
                  />
                ))}
              </div>

              {/* Total Amount Section */}
              <PurchaseTotalSection totalAmount={totalAmount} />

              {/* Hidden total amount field (still needed for form submission) */}
              <input
                type="hidden"
                {...form.register("totalAmount")}
                value={totalAmount}
              />

              {/* Form Actions Section */}
              <PurchaseFormActions
                isPending={isPending}
                onCancel={() => router.back()}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPurchasePage;
