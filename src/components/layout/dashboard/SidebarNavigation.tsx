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
  ClockIcon,
  BellIcon,
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
    name: "Aktivitas",
    href: "/dashboard/activity",
    icon: ClockIcon,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
  },
  {
    name: "Notifikasi",
    href: "/dashboard/notifications",
    icon: BellIcon,
    roles: [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access
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
      <nav className="flex-1 space-y-1 px-2 py-4 bg-gray-100 dark:bg-gray-800">
        {filteredNavigation.map((item) => {
          const isCurrent =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <div key={item.name}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={classNames(
                        isCurrent
                          ? "bg-blue-100 text-blue-700 dark:bg-gray-900 dark:text-white"
                          : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-500 ease-in-out"
                      )}
                      onClick={onItemClick}
                    >
                      {/* Icon container - always fixed width */}
                      <div className="w-6 flex-shrink-0 flex justify-center">
                        <item.icon
                          className={classNames(
                            isCurrent
                              ? "text-blue-600 dark:text-gray-300"
                              : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300",
                            "h-6 w-6 transition-all duration-500 ease-in-out"
                          )}
                          aria-hidden="true"
                        />
                      </div>

                      {/* Text container - transitions opacity and width */}
                      <div
                        className={classNames(
                          "ml-3 transition-all duration-500 ease-in-out overflow-hidden",
                          "opacity-0 w-0"
                        )}
                      >
                        <span className="truncate">{item.name}</span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href={item.href}
                  className={classNames(
                    isCurrent
                      ? "bg-blue-100 text-blue-700 dark:bg-gray-900 dark:text-white"
                      : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-500 ease-in-out"
                  )}
                  onClick={onItemClick}
                >
                  {/* Icon container - always fixed width */}
                  <div className="w-6 flex-shrink-0 flex justify-center">
                    <item.icon
                      className={classNames(
                        isCurrent
                          ? "text-blue-600 dark:text-gray-300"
                          : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300",
                        "h-6 w-6 transition-all duration-500 ease-in-out"
                      )}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Text container - transitions opacity and width */}
                  <div className="ml-3 flex-1 transition-all duration-500 ease-in-out">
                    <span className="truncate">{item.name}</span>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};

export default SidebarNavigation;
