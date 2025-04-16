export interface Supplier {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColumnVisibility {
  name: boolean;
  contactName: boolean;
  email: boolean;
  phone: boolean;
  address: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  notes: boolean;
}

export const supplierCategories = [
  { value: "product", label: "Produk" },
  { value: "service", label: "Jasa" },
  { value: "both", label: "Produk & Jasa" },
];

export interface SupplierStatus {
  active: number;
  inactive: number;
  total: number;
}
