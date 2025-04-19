"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { DeviceType, ServiceStatus } from "@prisma/client";

// Import the service schema from the components
import { EnhancedServiceSchema } from "@/components/pages/dashboard/services/new/types";

/**
 * Add a new service to the database
 */
export const addService = async (
  values: z.infer<typeof EnhancedServiceSchema>
) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  // 1. Validate input server-side
  const validatedFields = EnhancedServiceSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const {
    serviceNumber,
    customerName,
    customerPhone,
    customerEmail,
    deviceType,
    deviceBrand,
    deviceModel,
    deviceSerialNumber,
    problemDescription,
    estimatedCost,
    estimatedCompletionDate,
    diagnosisNotes,
    repairNotes,
    warrantyPeriod,
    // Other fields not used directly in the create operation
    // priorityLevel,
    // customerId,
    // attachments,
  } = validatedFields.data;

  try {
    // 2. Create service in database
    const service = await db.service.create({
      data: {
        serviceNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null, // Convert empty string to null
        deviceType: deviceType as DeviceType,
        deviceBrand,
        deviceModel,
        deviceSerialNumber: deviceSerialNumber || null,
        problemDescription,
        diagnosisNotes: diagnosisNotes || null,
        repairNotes: repairNotes || null,
        estimatedCost: estimatedCost !== undefined ? estimatedCost : null,
        warrantyPeriod: warrantyPeriod !== undefined ? warrantyPeriod : 0,
        estimatedCompletionDate: estimatedCompletionDate
          ? new Date(estimatedCompletionDate)
          : null,
        status: ServiceStatus.PENDING, // Default status for new services
        userId,
      },
    });

    // 3. Create initial service history entry
    await db.serviceStatusHistory.create({
      data: {
        status: ServiceStatus.PENDING,
        notes: "Servis baru dibuat",
        changedBy: userId,
        serviceId: service.id,
      },
    });

    // 4. Revalidate the services page cache
    revalidatePath("/dashboard/services/management");

    return {
      success: "Servis berhasil ditambahkan!",
      service: {
        id: service.id,
        serviceNumber: service.serviceNumber,
      },
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal menambahkan servis ke database." };
  }
};

/**
 * Update an existing service in the database
 */
export const updateService = async (
  id: string,
  values: z.infer<typeof EnhancedServiceSchema>
) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  // 1. Validate input server-side
  const validatedFields = EnhancedServiceSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(
      "Validation Error:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "Input tidak valid!" };
  }

  const {
    serviceNumber,
    customerName,
    customerPhone,
    customerEmail,
    deviceType,
    deviceBrand,
    deviceModel,
    deviceSerialNumber,
    problemDescription,
    estimatedCost,
    estimatedCompletionDate,
    diagnosisNotes,
    repairNotes,
    warrantyPeriod,
  } = validatedFields.data;

  try {
    // 2. Update service in database
    const service = await db.service.update({
      where: {
        id,
        userId, // Ensure the service belongs to the current user
      },
      data: {
        serviceNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null, // Convert empty string to null
        deviceType: deviceType as DeviceType,
        deviceBrand,
        deviceModel,
        deviceSerialNumber: deviceSerialNumber || null,
        problemDescription,
        diagnosisNotes: diagnosisNotes || null,
        repairNotes: repairNotes || null,
        estimatedCost: estimatedCost !== undefined ? estimatedCost : null,
        warrantyPeriod: warrantyPeriod !== undefined ? warrantyPeriod : 0,
        estimatedCompletionDate: estimatedCompletionDate
          ? new Date(estimatedCompletionDate)
          : null,
      },
    });

    // 3. Revalidate the services page cache
    revalidatePath("/dashboard/services/management");
    revalidatePath(`/dashboard/services/management/${id}`);

    return {
      success: "Servis berhasil diperbarui!",
      service: {
        id: service.id,
        serviceNumber: service.serviceNumber,
      },
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal memperbarui servis." };
  }
};

/**
 * Update the status of a service
 */
export const updateServiceStatus = async (
  id: string,
  status: ServiceStatus,
  notes?: string
) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    // 1. Update service status
    const service = await db.service.update({
      where: {
        id,
        userId, // Ensure the service belongs to the current user
      },
      data: {
        status,
        // Update completion date if status is COMPLETED
        completedDate:
          status === ServiceStatus.COMPLETED ? new Date() : undefined,
        // Update delivery date if status is DELIVERED
        deliveredDate:
          status === ServiceStatus.DELIVERED ? new Date() : undefined,
      },
    });

    // 2. Create service history entry
    await db.serviceStatusHistory.create({
      data: {
        status,
        notes: notes || `Status diubah menjadi ${status}`,
        changedBy: userId,
        serviceId: id,
      },
    });

    // 3. Revalidate the services page cache
    revalidatePath("/dashboard/services/management");
    revalidatePath(`/dashboard/services/management/${id}`);

    return {
      success: "Status servis berhasil diperbarui!",
      service: {
        id: service.id,
        status: service.status,
      },
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal memperbarui status servis." };
  }
};

/**
 * Delete a service from the database
 */
export const deleteService = async (id: string) => {
  // Get effective user ID (owner ID if employee, user's own ID otherwise)
  const effectiveUserId = await getEffectiveUserId();

  if (!effectiveUserId) {
    return { error: "Tidak terautentikasi!" };
  }
  const userId = effectiveUserId;

  try {
    // 1. First delete all service history entries
    await db.serviceStatusHistory.deleteMany({
      where: {
        serviceId: id,
      },
    });

    // 2. Delete the service
    await db.service.delete({
      where: {
        id,
        userId, // Ensure the service belongs to the current user
      },
    });

    // 3. Revalidate the services page cache
    revalidatePath("/dashboard/services/management");

    return { success: "Servis berhasil dihapus!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal menghapus servis." };
  }
};
