"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ChartBarIcon,
  TruckIcon,
  CubeIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Navigation items
export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Penjualan", href: "/dashboard/sales", icon: CurrencyDollarIcon },
  { name: "Pembelian", href: "/dashboard/purchases", icon: TruckIcon },
  { name: "Produk", href: "/dashboard/products", icon: CubeIcon },
  { name: "Daftar Customers", href: "/dashboard/customers", icon: UsersIcon },
  {
    name: "Suppliers",
    href: "/dashboard/suppliers",
    icon: BuildingStorefrontIcon,
  },
  { name: "Laporan", href: "/dashboard/reports", icon: ChartBarIcon },
  {
    name: "Pengaturan",
    href: "/dashboard/settings/account",
    icon: Cog6ToothIcon,
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

  return (
    <TooltipProvider delayDuration={100}>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
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
