import React from "react";
import Link from "next/link";
import { Product, ColumnVisibility } from "../types"; // Import from the new types file

interface ProductTableDesktopProps {
  products: Product[];
  columnVisibility: ColumnVisibility;
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => React.ReactNode;
  getStockStatusBadge: (stock: number) => React.ReactNode;
  searchTerm: string;
}

export const ProductTableDesktop: React.FC<ProductTableDesktopProps> = ({
  products,
  columnVisibility,
  handleSort,
  getSortIcon,
  getStockStatusBadge,
  searchTerm,
}) => {
  return (
    <div className="relative overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            {columnVisibility.name && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nama Produk
                  {getSortIcon("name")}
                </div>
              </th>
            )}
            {columnVisibility.sku && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("sku")}
              >
                <div className="flex items-center">
                  Kode Produk
                  {getSortIcon("sku")}
                </div>
              </th>
            )}
            {columnVisibility.category && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Kategori Produk
                  {getSortIcon("category")}
                </div>
              </th>
            )}
            {columnVisibility.price && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center">
                  Harga
                  {getSortIcon("price")}
                </div>
              </th>
            )}
            {columnVisibility.stock && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("stock")}
              >
                <div className="flex items-center">
                  Total Stok
                  {getSortIcon("stock")}
                </div>
              </th>
            )}
            {columnVisibility.cost && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("cost")}
              >
                <div className="flex items-center">
                  Harga Beli
                  {getSortIcon("cost")}
                </div>
              </th>
            )}
            {columnVisibility.sellPrice && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("price")} // Assuming sellPrice sorts by price
              >
                <div className="flex items-center">
                  Harga Jual
                  {getSortIcon("price")}
                </div>
              </th>
            )}
            {columnVisibility.discountPrice && (
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("discountPrice")} // Need a field for this if sorting is needed
              >
                <div className="flex items-center">
                  Harga Diskon
                  {getSortIcon("discountPrice")}
                </div>
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-right">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.id}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {columnVisibility.name && (
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {product.name}
                  </td>
                )}
                {columnVisibility.sku && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {product.sku || "-"}
                  </td>
                )}
                {columnVisibility.category && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {product.category?.name || "-"}
                  </td>
                )}
                {columnVisibility.price && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                )}
                {columnVisibility.stock && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {getStockStatusBadge(product.stock)}
                  </td>
                )}
                {columnVisibility.cost && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {product.cost
                      ? `Rp ${product.cost.toLocaleString("id-ID")}`
                      : "-"}
                  </td>
                )}
                {columnVisibility.sellPrice && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                )}
                {columnVisibility.discountPrice && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    - {/* Placeholder for discount price */}
                  </td>
                )}
                <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    Detail
                  </Link>
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
                  ? "Tidak ada produk yang sesuai dengan pencarian."
                  : "Belum ada data produk."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
