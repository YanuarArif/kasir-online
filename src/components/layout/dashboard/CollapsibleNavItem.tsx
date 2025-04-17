"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { classNames } from "./SidebarNavigation";

interface NavItemChild {
  name: string;
  href: string;
  icon?: React.ElementType;
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
  // Create a unique key for this menu item to store in localStorage
  const storageKey = `nav-expanded-${item.name.toLowerCase().replace(/\s+/g, "-")}`;

  // Initialize state from localStorage or default value
  const [isExpanded, setIsExpanded] = useState(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(storageKey);
      return savedState !== null ? savedState === "true" : defaultExpanded;
    }
    return defaultExpanded;
  });

  // Check if any child is active
  const isChildActive = item.children.some(
    (child) => child.href && pathname.startsWith(child.href)
  );

  // Toggle expanded state and save to localStorage
  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const newState = !prev;
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, String(newState));
      }
      return newState;
    });
  };

  // Update localStorage when isExpanded changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, String(isExpanded));
    }
  }, [isExpanded, storageKey]);

  // Auto-expand menu when a child item is active
  useEffect(() => {
    if (isChildActive && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isChildActive, pathname]);

  // Check if this is the Layanan menu item
  const isLayananMenu = item.name === "Layanan";

  // Get the position of the button for Layanan menu
  const [menuPosition, setMenuPosition] = useState(0);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Update the position when the component mounts or when the sidebar collapses/expands
  useEffect(() => {
    if (isLayananMenu && isCollapsed && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setMenuPosition(rect.top);
        }
      };

      // Initial position
      updatePosition();

      // Update on resize and scroll
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      // Run update position on a short delay to ensure DOM is fully rendered
      const timer = setTimeout(updatePosition, 100);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
        clearTimeout(timer);
      };
    }
  }, [isLayananMenu, isCollapsed]);

  return (
    <div className="space-y-1">
      {/* Parent Item */}
      {isCollapsed ? (
        isLayananMenu ? (
          <button
            ref={buttonRef}
            onClick={toggleExpand}
            className={classNames(
              isChildActive
                ? "bg-blue-100 text-blue-700 dark:bg-gray-900 dark:text-white"
                : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
              "group relative flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 z-20",
              "layanan-menu"
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
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleExpand}
                className={classNames(
                  isChildActive
                    ? "bg-blue-100 text-blue-700 dark:bg-gray-900 dark:text-white"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                  "group relative flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 z-20"
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
        )
      ) : (
        <button
          onClick={toggleExpand}
          className={classNames(
            isChildActive
              ? "bg-blue-100 text-blue-700 dark:bg-gray-900 dark:text-white"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
            "group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-all duration-500 ease-in-out cursor-pointer"
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
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform duration-200" />
            )}
          </div>
        </button>
      )}

      {/* Child Items - Shown when expanded or when hovering over parent in collapsed mode */}
      {(isExpanded || isCollapsed) && (
        <div
          style={
            isCollapsed && isLayananMenu
              ? {
                  position: "fixed",
                  left: "4rem",
                  top: `${menuPosition}px`,
                  zIndex: 9999,
                  display: "none",
                  marginTop: "0",
                }
              : {}
          }
          className={classNames(
            isCollapsed
              ? isLayananMenu
                ? "w-48 rounded-md shadow-lg z-[9999] bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out"
                : "absolute left-full top-0 ml-1 w-40 rounded-md shadow-lg z-50 bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out"
              : "ml-8 space-y-0.5 mt-1 relative",
            isCollapsed
              ? isLayananMenu
                ? "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transform scale-95 group-hover:scale-100 transition-all duration-200 ease-in-out layanan-submenu"
                : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transform scale-95 group-hover:scale-100 transition-all duration-200 ease-in-out"
              : ""
          )}
        >
          {/* Vertical line for submenu */}
          {!isCollapsed && (
            <div className="absolute left-[-20px] top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-600"></div>
          )}

          {item.children.map((child) => {
            const isChildItemActive =
              child.href && pathname.startsWith(child.href);
            const ChildIcon = child.icon;

            return (
              <Link
                key={child.name}
                href={child.href}
                className={classNames(
                  isChildItemActive
                    ? "bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                  "group flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-300 ease-in-out",
                  isCollapsed
                    ? "border-b border-gray-200 dark:border-gray-700 last:border-0"
                    : ""
                )}
                onClick={onItemClick}
              >
                {/* Icon if available */}
                {ChildIcon && (
                  <div className="w-6 flex-shrink-0 flex justify-center">
                    <ChildIcon
                      className={classNames(
                        isChildItemActive
                          ? "text-blue-600 dark:text-gray-300"
                          : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300",
                        "h-3.5 w-3.5 transition-all duration-500 ease-in-out"
                      )}
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div
                  className={classNames(ChildIcon ? "ml-2" : "ml-4", "flex-1")}
                >
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
