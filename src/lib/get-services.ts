"use server";

import { db } from "@/lib/prisma";
import { getEffectiveUserId } from "./get-effective-user-id";
import {
  ServiceStatus as PrismaServiceStatus,
  DeviceType as PrismaDeviceType,
} from "@prisma/client";
import {
  Service,
  ServiceCounts,
  ServiceStatus,
  DeviceType,
} from "@/components/pages/dashboard/services/types";

/**
 * Maps Prisma DeviceType to frontend DeviceType
 */
function mapPrismaDeviceType(deviceType: PrismaDeviceType): DeviceType {
  switch (deviceType) {
    case PrismaDeviceType.LAPTOP:
      return DeviceType.LAPTOP;
    case PrismaDeviceType.DESKTOP:
      return DeviceType.DESKTOP;
    case PrismaDeviceType.PHONE:
      return DeviceType.PHONE;
    case PrismaDeviceType.TABLET:
      return DeviceType.TABLET;
    case PrismaDeviceType.PRINTER:
      return DeviceType.PRINTER;
    case PrismaDeviceType.OTHER:
    default:
      return DeviceType.OTHER;
  }
}

/**
 * Maps Prisma ServiceStatus to frontend ServiceStatus
 */
function mapPrismaServiceStatus(status: PrismaServiceStatus): ServiceStatus {
  switch (status) {
    case PrismaServiceStatus.PENDING:
      return ServiceStatus.PENDING;
    case PrismaServiceStatus.IN_PROGRESS:
      return ServiceStatus.IN_PROGRESS;
    case PrismaServiceStatus.WAITING_FOR_PARTS:
      return ServiceStatus.WAITING_FOR_PARTS;
    case PrismaServiceStatus.COMPLETED:
      return ServiceStatus.COMPLETED;
    case PrismaServiceStatus.CANCELLED:
      return ServiceStatus.CANCELLED;
    case PrismaServiceStatus.DELIVERED:
      return ServiceStatus.DELIVERED;
    default:
      return ServiceStatus.PENDING;
  }
}

/**
 * Fetches services for the current user or their owner if they're an employee
 * @returns Array of services or empty array if not authenticated
 */
export async function getServices(): Promise<Service[]> {
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return [];
  }

  try {
    const dbServices = await db.service.findMany({
      where: {
        userId: effectiveUserId,
      },
      include: {
        serviceHistory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert database model to frontend Service type
    const services: Service[] = dbServices.map((service) => ({
      id: service.id,
      serviceNumber: service.serviceNumber,
      customerName: service.customerName,
      customerPhone: service.customerPhone,
      customerEmail: service.customerEmail || undefined,
      deviceType: mapPrismaDeviceType(service.deviceType),
      deviceBrand: service.deviceBrand,
      deviceModel: service.deviceModel,
      deviceSerialNumber: service.deviceSerialNumber || undefined,
      problemDescription: service.problemDescription,
      diagnosisNotes: service.diagnosisNotes || undefined,
      repairNotes: service.repairNotes || undefined,
      estimatedCost: service.estimatedCost
        ? service.estimatedCost.toNumber()
        : undefined,
      finalCost: service.finalCost ? service.finalCost.toNumber() : undefined,
      status: mapPrismaServiceStatus(service.status),
      receivedDate: service.receivedDate.toISOString(),
      estimatedCompletionDate: service.estimatedCompletionDate
        ? service.estimatedCompletionDate.toISOString()
        : undefined,
      completedDate: service.completedDate
        ? service.completedDate.toISOString()
        : undefined,
      deliveredDate: service.deliveredDate
        ? service.deliveredDate.toISOString()
        : undefined,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      userId: service.userId,
      customerId: service.customerId || undefined,
      serviceHistory: service.serviceHistory.map((history) => ({
        id: history.id,
        status: mapPrismaServiceStatus(history.status),
        notes: history.notes || undefined,
        changedAt: history.changedAt.toISOString(),
        changedBy: history.changedBy,
        serviceId: history.serviceId,
      })),
    }));

    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

/**
 * Calculates service counts by status
 * @param services Array of services
 * @returns Object with counts for each status
 */
export async function calculateServiceCounts(
  services: Service[]
): Promise<ServiceCounts> {
  return {
    pending: services.filter((s) => s.status === ServiceStatus.PENDING).length,
    inProgress: services.filter((s) => s.status === ServiceStatus.IN_PROGRESS)
      .length,
    waitingForParts: services.filter(
      (s) => s.status === ServiceStatus.WAITING_FOR_PARTS
    ).length,
    completed: services.filter(
      (s) =>
        s.status === ServiceStatus.COMPLETED ||
        s.status === ServiceStatus.DELIVERED
    ).length,
    total: services.length,
  };
}

/**
 * Fetches a single service by ID
 * @param id Service ID
 * @returns Service object or null if not found
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    console.error("User ID not found in session on protected route.");
    return null;
  }

  try {
    const service = await db.service.findUnique({
      where: {
        id,
        userId: effectiveUserId,
      },
      include: {
        serviceHistory: true,
      },
    });

    if (!service) {
      return null;
    }

    // Convert database model to frontend Service type
    return {
      id: service.id,
      serviceNumber: service.serviceNumber,
      customerName: service.customerName,
      customerPhone: service.customerPhone,
      customerEmail: service.customerEmail || undefined,
      deviceType: mapPrismaDeviceType(service.deviceType),
      deviceBrand: service.deviceBrand,
      deviceModel: service.deviceModel,
      deviceSerialNumber: service.deviceSerialNumber || undefined,
      problemDescription: service.problemDescription,
      diagnosisNotes: service.diagnosisNotes || undefined,
      repairNotes: service.repairNotes || undefined,
      estimatedCost: service.estimatedCost
        ? service.estimatedCost.toNumber()
        : undefined,
      finalCost: service.finalCost ? service.finalCost.toNumber() : undefined,
      status: mapPrismaServiceStatus(service.status),
      receivedDate: service.receivedDate.toISOString(),
      estimatedCompletionDate: service.estimatedCompletionDate
        ? service.estimatedCompletionDate.toISOString()
        : undefined,
      completedDate: service.completedDate
        ? service.completedDate.toISOString()
        : undefined,
      deliveredDate: service.deliveredDate
        ? service.deliveredDate.toISOString()
        : undefined,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      userId: service.userId,
      customerId: service.customerId || undefined,
      serviceHistory: service.serviceHistory.map((history) => ({
        id: history.id,
        status: mapPrismaServiceStatus(history.status),
        notes: history.notes || undefined,
        changedAt: history.changedAt.toISOString(),
        changedBy: history.changedBy,
        serviceId: history.serviceId,
      })),
    };
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}
