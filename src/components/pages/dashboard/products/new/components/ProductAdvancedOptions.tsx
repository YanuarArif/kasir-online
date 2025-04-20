"use client";

import React, { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ProductFormValues } from "../types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { getCategories } from "@/actions/categories";
import { toast } from "sonner";
import AddCategoryDialog from "./AddCategoryDialog";

interface ProductAdvancedOptionsProps {
  control: Control<ProductFormValues>;
  isPending: boolean;
}

const ProductAdvancedOptions: React.FC<ProductAdvancedOptionsProps> = ({
  control,
  isPending,
}) => {
  // State for categories
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const result = await getCategories();
        if (result.error) {
          toast.error(result.error);
          return;
        }
        if (result.categories) {
          setCategories(result.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Gagal mengambil data kategori");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category added
  const handleCategoryAdded = (category: { id: string; name: string }) => {
    setCategories((prev) => [...prev, category]);
  };

  // State for tags input
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);

  // Handle adding a new tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput("");

      // Update form value
      control._formValues.tags = newTags;
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);

    // Update form value
    control._formValues.tags = newTags;
  };

  // Handle key press in tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Kategori Produk</h3>
        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori (Opsional)</FormLabel>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    disabled={isPending || isLoadingCategories}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                          {isLoadingCategories
                            ? "Memuat kategori..."
                            : "Belum ada kategori"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <AddCategoryDialog onCategoryAdded={handleCategoryAdded} />
              </div>
              <FormDescription>
                Pilih kategori untuk memudahkan pencarian produk
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      {/* Tags Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Tag Produk</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Tambahkan tag (tekan Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyPress}
              disabled={isPending}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={isPending || !tagInput.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                    disabled={isPending}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                Belum ada tag. Tambahkan tag untuk memudahkan pencarian produk.
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Product Variants */}
      <div>
        <h3 className="text-lg font-medium mb-4">Varian Produk</h3>
        <FormField
          control={control}
          name="hasVariants"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Aktifkan Varian</FormLabel>
                <FormDescription>
                  Aktifkan jika produk ini memiliki varian seperti ukuran,
                  warna, dll.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {control._formValues.hasVariants && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Fitur varian produk akan tersedia setelah produk disimpan. Anda
              dapat menambahkan varian seperti ukuran, warna, dll. setelah
              produk dibuat.
            </p>
          </div>
        )}
      </div>

      <Separator />

      {/* Shipping Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Informasi Pengiriman</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Berat (gram)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    min="0"
                    step="1"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="dimensions.length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Panjang (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    min="0"
                    step="0.1"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="dimensions.width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lebar (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    min="0"
                    step="0.1"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="dimensions.height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tinggi (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    min="0"
                    step="0.1"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductAdvancedOptions;
