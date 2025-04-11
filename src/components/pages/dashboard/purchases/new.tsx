"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PurchaseSchema } from "@/schemas/zod";
import { addPurchase } from "@/actions/purchases";
import DashboardLayout from "@/components/layout/dashboardlayout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

// Define the type for the form values
type PurchaseFormValues = z.infer<typeof PurchaseSchema>;

// Define the type for products and suppliers
interface Product {
  id: string;
  name: string;
  cost: number | null;
}

interface Supplier {
  id: string;
  name: string;
}

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

  // Get the items field array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch for changes in the items array to calculate the total
  const items = form.watch("items");

  // Calculate total amount whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.costAtPurchase || 0);
    }, 0);
    setTotalAmount(total);
    form.setValue("totalAmount", total);
  }, [items, form]);

  // Handle product selection
  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct && selectedProduct.cost) {
      form.setValue(`items.${index}.costAtPurchase`, selectedProduct.cost);

      // Force recalculation of total immediately
      const currentItems = form.getValues("items");

      // Update the current item with the new cost before calculating total
      currentItems[index].costAtPurchase = selectedProduct.cost;

      const total = currentItems.reduce((sum, item) => {
        return sum + (item.quantity || 0) * (item.costAtPurchase || 0);
      }, 0);

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
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Tambah Pembelian Baru
          </CardTitle>
          <CardDescription>
            Catat transaksi pembelian baru dengan mengisi detail di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Purchase Info */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Invoice Reference */}
                <FormField
                  control={form.control}
                  name="invoiceRef"
                  render={({ field }) => (
                    <FormItem>
                      {/* FormLabel likely handles dark mode */}
                      <FormLabel>Nomor Invoice/Referensi</FormLabel>
                      <FormControl>
                        {/* Input likely handles dark mode, but ensure placeholder is visible */}
                        <Input
                          placeholder="Contoh: INV-2024-001"
                          {...field}
                          disabled={isPending}
                          // className="dark:placeholder-gray-400" // Input component might handle this
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Supplier Selection */}
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      {/* FormLabel likely handles dark mode */}
                      <FormLabel>Supplier</FormLabel>
                      <FormControl>
                        {/* Add dark mode styles to select */}
                        <select
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
                          {...field}
                          disabled={isPending}
                        >
                          <option value="">Pilih Supplier (Opsional)</option>
                          {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Purchase Items */}
              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  {/* Add dark mode text color */}
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Item Pembelian
                  </h3>
                  {/* Button likely handles dark mode */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ productId: "", quantity: 1, costAtPurchase: 0 })
                    }
                    disabled={isPending}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Tambah Item
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    // Add dark mode border
                    className="grid grid-cols-12 gap-4 items-end border dark:border-gray-700 p-4 rounded-md"
                  >
                    {/* Product Selection */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-5">
                          <FormLabel>
                            {/* Add dark mode to required indicator */}
                            Produk{" "}
                            <span className="text-red-500 dark:text-red-400">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            {/* Add dark mode styles to select */}
                            <select
                              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleProductChange(index, e.target.value);
                              }}
                              disabled={isPending}
                            >
                              <option value="">Pilih Produk</option>
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="col-span-4 md:col-span-2">
                          <FormLabel>
                            {/* Add dark mode to required indicator */}
                            Jumlah{" "}
                            <span className="text-red-500 dark:text-red-400">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            {/* Input likely handles dark mode */}
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              {...field}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                field.onChange(value || 1);
                              }}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Cost */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.costAtPurchase`}
                      render={({ field }) => (
                        <FormItem className="col-span-6 md:col-span-3">
                          <FormLabel>
                            {/* Ensure dark mode on required indicator */}
                            Harga Beli (Rp){" "}
                            <span className="text-red-500 dark:text-red-400">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            {/* Input likely handles dark mode */}
                            <Input
                              type="number"
                              min="0"
                              step="any"
                              {...field}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(value || 0);
                              }}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subtotal (calculated) */}
                    <div className="col-span-10 md:col-span-1 flex items-center">
                      {/* Add dark mode text color */}
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rp{" "}
                        {(
                          (items[index]?.quantity || 0) *
                          (items[index]?.costAtPurchase || 0)
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={isPending}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount (Read-only) */}
              {/* Add dark mode text colors */}
              <div className="flex justify-end items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Total:
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Hidden total amount field */}
              <input
                type="hidden"
                {...form.register("totalAmount")}
                value={totalAmount}
              />

              {/* Submit Button */}
              {/* Buttons likely handle dark mode */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan Pembelian"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPurchasePage;
