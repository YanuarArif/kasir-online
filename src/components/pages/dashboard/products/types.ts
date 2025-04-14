export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  cost: number | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  category: Category | null;
}

export interface StockCounts {
  available: number;
  low: number;
  outOfStock: number;
  needsApproval: number;
}

export interface ColumnVisibility {
  name: boolean;
  sku: boolean;
  category: boolean;
  price: boolean;
  stock: boolean;
  cost: boolean;
  sellPrice: boolean;
  discountPrice: boolean;
}
