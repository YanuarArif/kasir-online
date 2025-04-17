"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import {
  Home,
  BarChart,
  Truck,
  Package,
  Settings,
  DollarSign,
  Users,
  Store,
  UserCog,
  Wrench,
  ClipboardList,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavItem from "./NavItem";
import CollapsibleNavItem from "./CollapsibleNavItem";

// Navigation items with role-based access control
export const navigation = [
  {
    name: "Ringkasan",
    href: "/dashboard/summaries",
    icon: Home,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
  {
    name: "Penjualan",
    href: "/dashboard/sales",
    icon: DollarSign,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
  {
    name: "Pembelian",
    href: "/dashboard/purchases",
    icon: Truck,
    roles: [Role.OWNER, Role.ADMIN], // Only OWNER and ADMIN can access
  },
  {
    name: "Produk",
    href: "/dashboard/products",
    icon: Package,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
  {
    name: "Daftar Customers",
    href: "/dashboard/customers",
    icon: Users,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
  {
    name: "Suppliers",
    href: "/dashboard/suppliers",
    icon: Store,
    roles: [Role.OWNER, Role.ADMIN], // Only OWNER and ADMIN can access
  },
  {
    name: "Layanan",
    icon: Wrench,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
    hasChildren: true,
    children: [
      {
        name: "Manajemen Servis",
        href: "/dashboard/services/management",
        icon: ClipboardList,
        roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
      },
    ],
  },
  {
    name: "Karyawan",
    href: "/dashboard/settings/employees",
    icon: UserCog,
    roles: [Role.OWNER], // Only OWNER can access
  },
  {
    name: "Laporan",
    href: "/dashboard/reports",
    icon: BarChart,
    roles: [Role.OWNER, Role.ADMIN], // Only OWNER and ADMIN can access
  },
  {
    name: "Pengaturan",
    href: "/dashboard/settings/account",
    icon: Settings,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
];

// Helper function for class names
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SidebarNavigationProps {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isCollapsed = false,
  onItemClick,
}) => {
  const { data: session } = useSession();
  const userRole = session?.user?.role as Role | undefined;

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) => {
    // If no roles specified or user has no role, show the item
    if (!item.roles || !userRole) return true;
    // Otherwise, check if user's role is in the allowed roles
    return item.roles.includes(userRole);
  });

  return (
    <TooltipProvider delayDuration={100}>
      <nav className="flex-1 space-y-1 px-2 py-4 bg-gray-100 dark:bg-gray-800">
        {filteredNavigation.map((item) => {
          // Check if this is a parent item with children
          const hasChildren = item.hasChildren && item.children;

          // Special handling for Layanan menu
          const isLayananMenu = item.name === "Layanan";

          return (
            <div
              key={item.name}
              className={`space-y-1 ${isLayananMenu && isCollapsed ? "group relative" : ""}`}
            >
              {hasChildren ? (
                <CollapsibleNavItem
                  item={item as any}
                  isCollapsed={isCollapsed}
                  onItemClick={onItemClick}
                  defaultExpanded={isLayananMenu && isCollapsed}
                />
              ) : (
                <NavItem
                  item={item as any}
                  isCollapsed={isCollapsed}
                  onItemClick={onItemClick}
                />
              )}
            </div>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};

export default SidebarNavigation;
