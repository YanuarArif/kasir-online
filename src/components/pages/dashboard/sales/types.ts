export interface SaleItem {
  id: string;
  quantity: number;
  priceAtSale: number;
  saleId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  product: {
    name: string;
  };
}

export interface Sale {
  id: string;
  saleDate: Date;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  items: SaleItem[];
}

export interface SaleCounts {
  total: number;
  today: number;
  thisMonth: number;
  pending: number;
}

export interface ColumnVisibility {
  id: boolean;
  date: boolean;
  itemCount: boolean;
  totalAmount: boolean;
}
