"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SaleSchema } from "@/schemas/zod";
import { addSale } from "@/actions/sales";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SaleFormValues,
  Product,
} from "@/components/pages/dashboard/sales/new/types"; // Use alias
import SaleFormHeader from "@/components/pages/dashboard/sales/new/components/SaleFormHeader"; // Use alias
import SaleItemsHeader from "@/components/pages/dashboard/sales/new/components/SaleItemsHeader"; // Use alias
import SaleItemRow from "@/components/pages/dashboard/sales/new/components/SaleItemRow"; // Use alias
import SaleTotalSection from "@/components/pages/dashboard/sales/new/components/SaleTotalSection"; // Use alias
import SaleFormActions from "@/components/pages/dashboard/sales/new/components/SaleFormActions"; // Use alias

// Props use imported types
interface NewSalePageProps {
  products: Product[];
}

const NewSalePage: React.FC<NewSalePageProps> = ({ products }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Initialize the form
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(SaleSchema),
    defaultValues: {
      items: [{ productId: "", quantity: 1, priceAtSale: 0 }],
      totalAmount: 0,
    },
  });

  // Get the items field array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch for changes in the items array to calculate the total
  const items = form.watch("items");

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
        const result = await addSale(values);
        if (result.success) {
          toast.success(result.success);
          form.reset(); // Reset form on success
          // Redirect after a short delay
          router.push("/dashboard/sales");
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
        <SaleFormHeader />
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Sale Items Section */}
              <div className="space-y-4">
                <SaleItemsHeader
                  onAddItem={() =>
                    append({ productId: "", quantity: 1, priceAtSale: 0 })
                  }
                  isPending={isPending}
                />

                {fields.map((field, index) => (
                  <SaleItemRow
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
              <SaleTotalSection totalAmount={totalAmount} />

              {/* Hidden total amount field */}
              <input
                type="hidden"
                {...form.register("totalAmount")}
                value={totalAmount}
              />

              {/* Form Actions Section */}
              <SaleFormActions
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

export default NewSalePage;
