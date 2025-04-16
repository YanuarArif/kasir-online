"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import {
  HomeIcon,
  ChartBarIcon,
  TruckIcon,
  CubeIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavItem from "./NavItem";
import CollapsibleNavItem from "./CollapsibleNavItem";

// Navigation items with role-based access control
export const navigation = [
  {
    name: "Ringkasan",
    href: "/dashboard/summaries",
    icon: HomeIcon,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
  {
    name: "Penjualan",
    href: "/dashboard/sales",
    icon: CurrencyDollarIcon,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
  {
    name: "Pembelian",
    href: "/dashboard/purchases",
    icon: TruckIcon,
    roles: [Role.OWNER, Role.ADMIN], // Only OWNER and ADMIN can access
  },
  {
    name: "Produk",
    href: "/dashboard/products",
    icon: CubeIcon,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
  {
    name: "Daftar Customers",
    href: "/dashboard/customers",
    icon: UsersIcon,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
  {
    name: "Suppliers",
    href: "/dashboard/suppliers",
    icon: BuildingStorefrontIcon,
    roles: [Role.OWNER, Role.ADMIN], // Only OWNER and ADMIN can access
  },
  {
    name: "Layanan",
    icon: WrenchIcon,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
    hasChildren: true,
    children: [
      {
        name: "Manajemen Servis",
        href: "/dashboard/services/management",
        roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
      },
      {
        name: "Tracking Servis",
        href: "/dashboard/services/tracking",
        roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
      },
    ],
  },
  {
    name: "Karyawan",
    href: "/dashboard/settings/employees",
    icon: UserGroupIcon,
    roles: [Role.OWNER], // Only OWNER can access
  },
  {
    name: "Laporan",
    href: "/dashboard/reports",
    icon: ChartBarIcon,
    roles: [Role.OWNER, Role.ADMIN], // Only OWNER and ADMIN can access
  },
  {
    name: "Pengaturan",
    href: "/dashboard/settings/account",
    icon: Cog6ToothIcon,
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

          return (
            <div key={item.name} className="space-y-1">
              {hasChildren ? (
                <CollapsibleNavItem
                  item={item as any}
                  isCollapsed={isCollapsed}
                  onItemClick={onItemClick}
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
