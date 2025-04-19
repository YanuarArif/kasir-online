// Service Management Types

export enum ServiceStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  WAITING_FOR_PARTS = "WAITING_FOR_PARTS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DELIVERED = "DELIVERED",
}

export enum DeviceType {
  LAPTOP = "LAPTOP",
  DESKTOP = "DESKTOP",
  PHONE = "PHONE",
  TABLET = "TABLET",
  PRINTER = "PRINTER",
  OTHER = "OTHER",
}

export interface ServiceStatusHistory {
  id: string;
  status: ServiceStatus;
  notes?: string;
  changedAt: string;
  changedBy: string;
  serviceId: string;
}

export interface Service {
  id: string;
  serviceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deviceType: DeviceType;
  deviceBrand: string;
  deviceModel: string;
  deviceSerialNumber?: string;
  problemDescription: string;
  diagnosisNotes?: string;
  repairNotes?: string;
  estimatedCost?: number;
  finalCost?: number;
  warrantyPeriod?: number;
  status: ServiceStatus;
  receivedDate: string;
  estimatedCompletionDate?: string;
  completedDate?: string;
  deliveredDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  customerId?: string;
  serviceHistory?: ServiceStatusHistory[];
}

export interface ServiceCounts {
  pending: number;
  inProgress: number;
  waitingForParts: number;
  completed: number;
  total: number;
}

export interface ColumnVisibility {
  serviceNumber: boolean;
  customerName: boolean;
  customerPhone: boolean;
  deviceType: boolean;
  deviceBrand: boolean;
  deviceModel: boolean;
  deviceSerialNumber: boolean;
  status: boolean;
  receivedDate: boolean;
  estimatedCompletionDate: boolean;
  estimatedCost: boolean;
  warrantyPeriod: boolean;
}
