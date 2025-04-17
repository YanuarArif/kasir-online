import ServicesPage from "@/components/pages/dashboard/services/services";
import React from "react";
import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { getServices, calculateServiceCounts } from "@/lib/get-services";

// This is an async Server Component
const Services = async () => {
  try {
    // Get the effective user ID (owner or employee)
    const effectiveUserId = await getEffectiveUserId();

    // If no user ID, return empty data
    if (!effectiveUserId) {
      return (
        <ServicesPage
          services={[]}
          serviceCounts={{
            pending: 0,
            inProgress: 0,
            waitingForParts: 0,
            completed: 0,
            total: 0,
          }}
        />
      );
    }

    // Fetch real service data from the database
    const services = await getServices();
    const serviceCounts = await calculateServiceCounts(services);

    // Return the ServicesPage component with data
    return <ServicesPage services={services} serviceCounts={serviceCounts} />;
  } catch (error) {
    console.error("Error fetching service data:", error);
    return (
      <p>Error: Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
    );
  }
};

export default Services;
