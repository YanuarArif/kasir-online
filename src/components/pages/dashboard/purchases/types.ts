export interface Product {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface PurchaseItem {
  id: string;
  quantity: number;
  costAtPurchase: number;
  purchaseId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  product: {
    name: string;
  };
}

export interface Purchase {
  id: string;
  purchaseDate: Date;
  totalAmount: number;
  invoiceRef: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  supplierId: string | null;
  supplier: Supplier | null;
  items: PurchaseItem[];
}

export interface PurchaseCounts {
  total: number;
  thisMonth: number;
  lastMonth: number;
  pending: number;
}

export interface ColumnVisibility {
  id: boolean;
  date: boolean;
  supplier: boolean;
  totalAmount: boolean;
  invoiceRef: boolean;
  itemCount: boolean;
}
