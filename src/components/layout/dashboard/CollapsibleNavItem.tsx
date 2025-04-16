"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { classNames } from "./SidebarNavigation";

interface NavItemChild {
  name: string;
  href: string;
  roles?: string[];
}

interface CollapsibleNavItemProps {
  item: {
    name: string;
    icon: React.ElementType;
    children: NavItemChild[];
    roles?: string[];
    hasChildren?: boolean;
    href?: string;
  };
  isCollapsed: boolean;
  onItemClick?: () => void;
  defaultExpanded?: boolean;
}

const CollapsibleNavItem: React.FC<CollapsibleNavItemProps> = ({
  item,
  isCollapsed,
  onItemClick,
  defaultExpanded = false,
}) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Check if any child is active
  const isChildActive = item.children.some(
    (child) => child.href && pathname.startsWith(child.href)
  );

  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="space-y-1">
      {/* Parent Item */}
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleExpand}
              className={classNames(
                isChildActive
                  ? "bg-blue-100 text-blue-700 dark:bg-gray-900 dark:text-white"
                  : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                "group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-500 ease-in-out"
              )}
            >
              {/* Icon container - always fixed width */}
              <div className="w-6 flex-shrink-0 flex justify-center">
                <item.icon
                  className={classNames(
                    isChildActive
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
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <button
          onClick={toggleExpand}
          className={classNames(
            isChildActive
              ? "bg-blue-100 text-blue-700 dark:bg-gray-900 dark:text-white"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
            "group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-all duration-500 ease-in-out"
          )}
        >
          <div className="flex items-center">
            {/* Icon container - always fixed width */}
            <div className="w-6 flex-shrink-0 flex justify-center">
              <item.icon
                className={classNames(
                  isChildActive
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
          </div>

          {/* Chevron icon */}
          <div className="ml-3">
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 transition-transform duration-200" />
            )}
          </div>
        </button>
      )}

      {/* Child Items */}
      {isExpanded && !isCollapsed && (
        <div className="ml-8 space-y-1 mt-1">
          {item.children.map((child) => {
            const isChildItemActive =
              child.href && pathname.startsWith(child.href);

            return (
              <Link
                key={child.name}
                href={child.href}
                className={classNames(
                  isChildItemActive
                    ? "bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-300 ease-in-out"
                )}
                onClick={onItemClick}
              >
                <div className="ml-3 flex-1">
                  <span className="truncate">{child.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollapsibleNavItem;
