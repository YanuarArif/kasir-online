export interface Customer {
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

export const customerCategories = [
  { value: "regular", label: "Reguler" },
  { value: "vip", label: "VIP" },
  { value: "wholesale", label: "Grosir" },
];

export interface CustomerStatus {
  active: number;
  inactive: number;
  total: number;
}
