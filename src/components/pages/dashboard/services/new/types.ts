import { z } from "zod";
import { DeviceType, ServiceStatus } from "../types";

// Basic Service Schema
export const ServiceSchema = z.object({
  serviceNumber: z.string().min(1, "Nomor servis harus diisi"),
  customerName: z.string().min(1, "Nama pelanggan harus diisi"),
  customerPhone: z.string().min(1, "Nomor telepon pelanggan harus diisi"),
  customerEmail: z.string().email("Email tidak valid").optional().or(z.literal("")),
  deviceType: z.nativeEnum(DeviceType),
  deviceBrand: z.string().min(1, "Merek perangkat harus diisi"),
  deviceModel: z.string().min(1, "Model perangkat harus diisi"),
  deviceSerialNumber: z.string().optional().or(z.literal("")),
  problemDescription: z.string().min(1, "Deskripsi masalah harus diisi"),
  estimatedCost: z.coerce.number().min(0, "Biaya estimasi tidak boleh negatif").optional(),
  estimatedCompletionDate: z.string().optional().or(z.literal("")),
});

// Enhanced Service Schema with additional fields
export const EnhancedServiceSchema = ServiceSchema.extend({
  diagnosisNotes: z.string().optional().or(z.literal("")),
  repairNotes: z.string().optional().or(z.literal("")),
  customerAddress: z.string().optional().or(z.literal("")),
  warrantyPeriod: z.coerce.number().min(0).optional(),
  priorityLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  customerId: z.string().optional().or(z.literal("")),
  attachments: z.array(z.string()).optional(),
});

// Form values type
export type ServiceFormValues = z.infer<typeof EnhancedServiceSchema>;

// Priority level options
export const priorityLevelOptions = [
  { value: "LOW", label: "Rendah" },
  { value: "MEDIUM", label: "Sedang" },
  { value: "HIGH", label: "Tinggi" },
];
