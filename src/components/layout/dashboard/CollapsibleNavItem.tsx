"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Fragment,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { classNames } from "./SidebarNavigation";
import { createPortal } from "react-dom";
import { Transition } from "@headlessui/react";

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
    // Always allow toggling, even when a child is active
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

  // Auto-expand menu when a child item is active, but only on initial load
  useEffect(() => {
    // Only auto-expand on initial render, not on subsequent navigation
    if (isChildActive && !isExpanded) {
      setIsExpanded(true);
    }
    // We're intentionally not including isExpanded in the dependency array
    // This ensures the effect only runs when the active state or pathname changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChildActive, pathname]);

  // Check if this is the Layanan menu item
  const isLayananMenu = item.name === "Layanan";

  // For Layanan menu dropdown positioning
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    opacity: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLayananDropdown, setShowLayananDropdown] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate position for the Layanan dropdown
  const calculatePosition = useCallback(() => {
    if (isLayananMenu && isCollapsed && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();

      setMenuPosition({
        top: buttonRect.top,
        left: buttonRect.right + 8, // 8px margin
        opacity: 1,
      });
    }
  }, [isLayananMenu, isCollapsed]);

  // Debounced position update
  const updatePosition = useCallback(() => {
    if (isLayananMenu && isCollapsed) {
      calculatePosition();
    }
  }, [isLayananMenu, isCollapsed, calculatePosition]);

  // Open dropdown
  const openDropdown = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowLayananDropdown(true);
    // Calculate position after render
    requestAnimationFrame(() => {
      calculatePosition();
    });
  }, [calculatePosition]);

  // Close dropdown with delay
  const closeDropdown = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowLayananDropdown(false);
    }, 150); // 150ms delay to allow moving to dropdown
  }, []);

  // Add event listeners
  useEffect(() => {
    if (isLayananMenu && isCollapsed && showLayananDropdown) {
      const handleResize = () => {
        requestAnimationFrame(updatePosition);
      };
      const handleScroll = () => {
        requestAnimationFrame(updatePosition);
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      // Initial position
      calculatePosition();

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [
    isLayananMenu,
    isCollapsed,
    showLayananDropdown,
    updatePosition,
    calculatePosition,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-1">
      {/* Parent Item */}
      {isCollapsed ? (
        isLayananMenu ? (
          <div
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
            className="w-full"
          >
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
          </div>
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
      {/* Regular submenu for expanded sidebar */}
      {!isCollapsed && isExpanded && (
        <div className={classNames("ml-8 space-y-0.5 mt-1 relative")}>
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
                    ? "bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
                    : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700/70 dark:hover:text-white border-l-4 border-transparent hover:border-blue-300 dark:hover:border-blue-500/50",
                  "group flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-300 ease-in-out",
                  isCollapsed
                    ? "border-b border-gray-200 dark:border-gray-700 last:border-0"
                    : ""
                )}
                onClick={onItemClick}
              >
                {/* Icon if available */}
                {ChildIcon && (
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-50 dark:bg-gray-700 mr-2">
                    <ChildIcon
                      className={classNames(
                        isChildItemActive
                          ? "text-blue-600 dark:text-blue-300"
                          : "text-blue-500 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-300",
                        "h-3.5 w-3.5 transition-all duration-300 ease-in-out"
                      )}
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <span className="truncate">{child.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Portal for Layanan dropdown in collapsed mode */}
      {isCollapsed &&
        isLayananMenu &&
        typeof document !== "undefined" &&
        createPortal(
          <Transition
            as={Fragment}
            show={showLayananDropdown}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95 translate-y-2"
            enterTo="transform opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100 translate-y-0"
            leaveTo="transform opacity-0 scale-95 translate-y-2"
          >
            <div
              ref={dropdownRef}
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
              className="fixed z-[9999] w-56 rounded-lg shadow-2xl bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out ring-1 ring-black/5 dark:ring-white/10"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                opacity: menuPosition.opacity,
                transition: "opacity 100ms ease-out",
              }}
            >
              {/* Header */}
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {item.name}
                </h3>
              </div>
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
                        ? "bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
                        : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700/70 dark:hover:text-white border-l-4 border-transparent hover:border-blue-300 dark:hover:border-blue-500/50",
                      "group flex items-center px-4 py-2 text-xs font-medium transition-all duration-300 ease-in-out",
                      "border-b border-gray-200 dark:border-gray-700 last:border-0"
                    )}
                    onClick={onItemClick}
                  >
                    {/* Icon if available */}
                    {ChildIcon && (
                      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-50 dark:bg-gray-700 mr-2">
                        <ChildIcon
                          className={classNames(
                            isChildItemActive
                              ? "text-blue-600 dark:text-blue-300"
                              : "text-blue-500 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-300",
                            "h-3.5 w-3.5 transition-all duration-300 ease-in-out"
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="truncate">{child.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Transition>,
          document.body
        )}
    </div>
  );
};

export default CollapsibleNavItem;
