"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { classNames } from "./SidebarNavigation";

interface NavItemProps {
  item: {
    name: string;
    href: string;
    icon: React.ElementType;
    roles?: string[];
    hasChildren?: boolean;
    children?: any[];
  };
  isCollapsed: boolean;
  onItemClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  item,
  isCollapsed,
  onItemClick,
}) => {
  const pathname = usePathname();

  // Check if this item is active
  const isCurrent =
    item.href === "/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href);

  return (
    <div>
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

          {/* Text container */}
          <div className="ml-3 flex-1 transition-all duration-500 ease-in-out">
            <span className="truncate">{item.name}</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default NavItem;
