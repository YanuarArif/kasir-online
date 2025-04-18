"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboardlayout";
import {
  Clock,
  Wrench,
  Truck,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  ArrowUpDownIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";

// Import types and components
import {
  Service,
  ServiceCounts,
  ColumnVisibility,
  ServiceStatus,
} from "./types";
import { ServiceStatusCards } from "./components/ServiceStatusCards";
import { ServiceActions } from "./components/ServiceActions";
import { ServiceTableDesktop } from "./components/ServiceTableDesktop";
import { StatusServiceTabContent } from "./components/StatusServiceTabContent";

interface ServicesPageProps {
  services: Service[];
  serviceCounts: ServiceCounts;
}

const ServicesPage: React.FC<ServicesPageProps> = (props) => {
  const { services = [], serviceCounts } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [mainTab, setMainTab] = useState("data-servis");
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedServices, setPaginatedServices] = useState<Service[]>([]);

  // Column visibility state with localStorage persistence
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    () => {
      // Try to get saved column visibility from localStorage
      if (typeof window !== "undefined") {
        const savedVisibility = localStorage.getItem("serviceColumnVisibility");
        if (savedVisibility) {
          try {
            return JSON.parse(savedVisibility) as ColumnVisibility;
          } catch (error) {
            console.error("Failed to parse saved column visibility:", error);
          }
        }
      }

      // Default column visibility if nothing in localStorage
      return {
        serviceNumber: true,
        customerName: true,
        customerPhone: true,
        deviceType: true,
        deviceBrand: true,
        deviceModel: true,
        deviceSerialNumber: false,
        status: true,
        receivedDate: true,
        estimatedCompletionDate: true,
        estimatedCost: false,
        warrantyPeriod: false,
      };
    }
  );

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Function to handle column sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new field, set it and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Function to get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDownIcon className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  // Filter and sort services based on search term and sort settings
  useEffect(() => {
    let result = [...services];

    // Reset to first page when filters change
    setCurrentPage(1);

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (service) =>
          service.serviceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.deviceBrand
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.deviceModel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting if a sort field is selected
    if (sortField) {
      result.sort((a, b) => {
        let valueA, valueB;

        // Handle different field types
        switch (sortField) {
          case "serviceNumber":
            valueA = a.serviceNumber.toLowerCase();
            valueB = b.serviceNumber.toLowerCase();
            break;
          case "customerName":
            valueA = a.customerName.toLowerCase();
            valueB = b.customerName.toLowerCase();
            break;
          case "customerPhone":
            valueA = a.customerPhone.toLowerCase();
            valueB = b.customerPhone.toLowerCase();
            break;
          case "deviceType":
            valueA = a.deviceType.toLowerCase();
            valueB = b.deviceType.toLowerCase();
            break;
          case "deviceBrand":
            valueA = a.deviceBrand.toLowerCase();
            valueB = b.deviceBrand.toLowerCase();
            break;
          case "deviceModel":
            valueA = a.deviceModel.toLowerCase();
            valueB = b.deviceModel.toLowerCase();
            break;
          case "deviceSerialNumber":
            valueA = (a.deviceSerialNumber || "").toLowerCase();
            valueB = (b.deviceSerialNumber || "").toLowerCase();
            break;
          case "status":
            valueA = a.status;
            valueB = b.status;
            break;
          case "receivedDate":
            valueA = new Date(a.receivedDate).getTime();
            valueB = new Date(b.receivedDate).getTime();
            break;
          case "estimatedCompletionDate":
            valueA = a.estimatedCompletionDate
              ? new Date(a.estimatedCompletionDate).getTime()
              : 0;
            valueB = b.estimatedCompletionDate
              ? new Date(b.estimatedCompletionDate).getTime()
              : 0;
            break;
          case "estimatedCost":
            valueA = a.estimatedCost || 0;
            valueB = b.estimatedCost || 0;
            break;
          case "warrantyPeriod":
            valueA = a.warrantyPeriod || 0;
            valueB = b.warrantyPeriod || 0;
            break;
          default:
            valueA = a[sortField as keyof Service] || "";
            valueB = b[sortField as keyof Service] || "";
        }

        // Compare based on direction
        if (sortDirection === "asc") {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      });
    }

    setFilteredServices(result);
  }, [services, searchTerm, sortField, sortDirection]);

  // Apply pagination to filtered services
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedServices(filteredServices.slice(startIndex, endIndex));
  }, [filteredServices, currentPage, itemsPerPage]);

  // Save column visibility to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "serviceColumnVisibility",
        JSON.stringify(columnVisibility)
      );
    }
  }, [columnVisibility]);

  // Function to get status badge
  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.PENDING:
        return (
          <Badge variant="default" className="bg-blue-500 whitespace-nowrap">
            <Clock className="h-3 w-3 mr-1" />
            Masuk
          </Badge>
        );
      case ServiceStatus.IN_PROGRESS:
        return (
          <Badge variant="default" className="bg-amber-500 whitespace-nowrap">
            <Wrench className="h-3 w-3 mr-1" />
            Diproses
          </Badge>
        );
      case ServiceStatus.WAITING_FOR_PARTS:
        return (
          <Badge variant="default" className="bg-purple-500 whitespace-nowrap">
            <Truck className="h-3 w-3 mr-1" />
            Menunggu Sparepart
          </Badge>
        );
      case ServiceStatus.COMPLETED:
        return (
          <Badge variant="default" className="bg-green-500 whitespace-nowrap">
            <CheckCircle className="h-3 w-3 mr-1" />
            Selesai
          </Badge>
        );
      case ServiceStatus.DELIVERED:
        return (
          <Badge variant="default" className="bg-green-700 whitespace-nowrap">
            <CheckCircle className="h-3 w-3 mr-1" />
            Diambil
          </Badge>
        );
      case ServiceStatus.CANCELLED:
        return (
          <Badge variant="destructive" className="whitespace-nowrap">
            Dibatalkan
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="whitespace-nowrap">
            {status}
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Main Tabs */}
        <Tabs
          defaultValue="data-servis"
          value={mainTab}
          onValueChange={setMainTab}
          className="w-full"
        >
          <TabsList className="mb-4 cursor-pointer">
            <TabsTrigger value="data-servis" className="cursor-pointer">
              Data Servis
            </TabsTrigger>
            <TabsTrigger value="status-servis" className="cursor-pointer">
              Status Servis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data-servis" className="space-y-6">
            {/* Service Status Summary Cards */}
            <ServiceStatusCards serviceCounts={serviceCounts} />

            {/* Header Actions */}
            <ServiceActions
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onFilterClick={() =>
                toast.info("Fitur filter akan segera hadir!")
              }
              onImportClick={() =>
                toast.info("Fitur import akan segera hadir!")
              }
              onExportClick={() =>
                toast.info("Fitur export akan segera hadir!")
              }
            />

            {/* Services List */}
            <div className="overflow-x-auto">
              {/* Table View */}
              <ServiceTableDesktop
                services={paginatedServices}
                columnVisibility={columnVisibility}
                handleSort={handleSort}
                getSortIcon={getSortIcon}
                getStatusBadge={getStatusBadge}
                searchTerm={searchTerm}
              />
            </div>

            {/* Pagination */}
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredServices.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                totalItems={filteredServices.length}
              />
            </div>
          </TabsContent>

          <TabsContent value="status-servis" className="space-y-6">
            <StatusServiceTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
