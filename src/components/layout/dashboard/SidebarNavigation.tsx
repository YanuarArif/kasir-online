"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const pathname = usePathname();
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
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isCurrent =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return isCollapsed ? (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={classNames(
                    isCurrent
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium justify-center"
                  )}
                  onClick={onItemClick}
                >
                  <item.icon
                    className={classNames(
                      isCurrent
                        ? "text-gray-300"
                        : "text-gray-400 group-hover:text-gray-300",
                      "h-6 w-6 flex-shrink-0 mx-auto"
                    )}
                    aria-hidden="true"
                  />
                  <span className="sr-only">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                isCurrent
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
              )}
              onClick={onItemClick}
            >
              <item.icon
                className={classNames(
                  isCurrent
                    ? "text-gray-300"
                    : "text-gray-400 group-hover:text-gray-300",
                  "h-6 w-6 flex-shrink-0 mr-3"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};

export default SidebarNavigation;
