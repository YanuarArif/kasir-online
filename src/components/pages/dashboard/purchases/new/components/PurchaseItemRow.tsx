import React from "react";
import { Control, UseFieldArrayRemove, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  PurchaseFormValues,
  Product,
} from "@/components/pages/dashboard/purchases/new/types"; // Use alias for types

interface PurchaseItemRowProps {
  control: Control<PurchaseFormValues>;
  index: number;
  field: FieldValues; // Or a more specific type if available from useFieldArray
  products: Product[];
  items: PurchaseFormValues["items"]; // Pass the watched items for subtotal calculation
  remove: UseFieldArrayRemove;
  handleProductChange: (index: number, productId: string) => void;
  isPending: boolean;
  canRemove: boolean; // To control the visibility of the remove button
}

const PurchaseItemRow: React.FC<PurchaseItemRowProps> = ({
  control,
  index,
  field,
  products,
  items,
  remove,
  handleProductChange,
  isPending,
  canRemove,
}) => {
  const item = items[index]; // Get current item data for subtotal calculation
  const subtotal = (item?.quantity || 0) * (item?.costAtPurchase || 0);

  return (
    <div
      key={field.id}
      className="grid grid-cols-12 gap-4 items-end border dark:border-gray-700 p-4 rounded-md"
    >
      {/* Product Selection */}
      <FormField
        control={control}
        name={`items.${index}.productId`}
        render={(
          { field: formField } // Rename inner 'field' to avoid conflict
        ) => (
          <FormItem className="col-span-12 md:col-span-5">
            <FormLabel>
              Produk <span className="text-red-500 dark:text-red-400">*</span>
            </FormLabel>
            <FormControl>
              <select
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
                {...formField}
                onChange={(e) => {
                  formField.onChange(e);
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
        control={control}
        name={`items.${index}.quantity`}
        render={({ field: formField }) => (
          <FormItem className="col-span-4 md:col-span-2">
            <FormLabel>
              Jumlah <span className="text-red-500 dark:text-red-400">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                step="1"
                {...formField}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  formField.onChange(value || 1);
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
        control={control}
        name={`items.${index}.costAtPurchase`}
        render={({ field: formField }) => (
          <FormItem className="col-span-6 md:col-span-3">
            <FormLabel>
              Harga Beli (Rp){" "}
              <span className="text-red-500 dark:text-red-400">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="any"
                {...formField}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  formField.onChange(value || 0);
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
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Rp {subtotal.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Remove Button */}
      <div className="col-span-2 md:col-span-1 flex justify-end">
        {canRemove && (
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
  );
};

export default PurchaseItemRow;
