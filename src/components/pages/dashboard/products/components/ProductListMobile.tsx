import React from "react";
import Link from "next/link";
import { Product } from "../types"; // Import from the types file

interface ProductListMobileProps {
  products: Product[];
  getStockStatusBadge: (stock: number) => React.ReactNode;
  searchTerm: string;
}

export const ProductListMobile: React.FC<ProductListMobileProps> = ({
  products,
  getStockStatusBadge,
  searchTerm,
}) => {
  return (
    <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Nama:
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-right break-words">
                {product.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Kode:
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {product.sku || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Kategori:
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-right break-words">
                {product.category?.name || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Harga Jual:
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Stok:
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {getStockStatusBadge(product.stock)}
              </span>
            </div>
            <div className="text-right pt-2">
              <Link
                href={`/dashboard/products/${product.id}`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
              >
                Detail
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {searchTerm
            ? "Tidak ada produk yang sesuai dengan pencarian."
            : "Belum ada data produk."}
        </div>
      )}
    </div>
  );
};
