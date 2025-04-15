"use client";

import React, {
  Fragment,
  useRef,
  useState,
  useCallback,
  useTransition,
  useEffect,
  useId,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { Popover, Transition } from "@headlessui/react"; // Using Popover
import { useSession } from "next-auth/react";
import { logout } from "@/actions/logout";
import { Role } from "@prisma/client";
import {
  UserIcon,
  Cog6ToothIcon,
  ReceiptRefundIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { RoleBadge } from "@/components/ui/role-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { classNames } from "./SidebarNavigation"; // Assuming this utility exists
import { createPortal } from "react-dom";

// --- Debounce Utility ---
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
  debounced.cancel = () => {
    if (timeout !== null) clearTimeout(timeout);
  };
  return debounced;
}

// --- Component Props ---
interface UserProfileMenuProps {
  isCollapsed?: boolean;
  position?: "sidebar" | "topbar";
}

// --- Constants ---
const POPOVER_WIDTH_CLASS = "w-60"; // Tailwind class for width (240px)
const POPOVER_MARGIN = 8;
const HOVER_CLOSE_DELAY = 150;

// --- Component ---
const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  isCollapsed = false,
  position = "sidebar",
}) => {
  // --- Hooks ---
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const [popoverPosition, setPopoverPosition] = useState({
    top: "auto",
    left: "auto",
    bottom: "auto",
    opacity: 0, // Start hidden for smooth positioning
  });
  const [isHoverPopoverOpen, setIsHoverPopoverOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverPanelRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonId = useId(); // Unique ID for ARIA linking

  // --- Computed Values ---
  const isSidebar = position === "sidebar";

  // --- Actions ---
  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  // --- Positioning Logic ---
  const calculateAndSetPosition = useCallback(() => {
    // Guard clauses for refs
    if (!buttonRef.current || !popoverPanelRef.current) {
      // console.warn("Positioning refs not ready");
      return;
    }

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const panelRect = popoverPanelRef.current.getBoundingClientRect(); // Use panel rect for actual dimensions
    const panelHeight = panelRect.height;
    const panelWidth = panelRect.width; // Use actual width

    let newTop: string | number = "auto";
    let newLeft: string | number = "auto";
    let newBottom: string | number = "auto";

    if (isSidebar) {
      // Sidebar: Position above button, left-aligned
      newBottom = window.innerHeight - buttonRect.top + POPOVER_MARGIN;
      newLeft = buttonRect.left;

      // Check if it overflows top viewport
      if (buttonRect.top - panelHeight - POPOVER_MARGIN < 0) {
        // console.log("Flipping to below (Sidebar)");
        newBottom = "auto"; // Reset bottom
        newTop = buttonRect.bottom + POPOVER_MARGIN; // Position below instead
      }

      // Prevent horizontal overflow (less likely needed for left-align)
      if (newLeft < POPOVER_MARGIN) newLeft = POPOVER_MARGIN;
      if (newLeft + panelWidth > window.innerWidth - POPOVER_MARGIN) {
        newLeft = window.innerWidth - panelWidth - POPOVER_MARGIN;
      }
    } else {
      // Topbar: Position below button, right-aligned (default)
      newTop = buttonRect.bottom + POPOVER_MARGIN;
      newLeft = buttonRect.right - panelWidth; // Align right edges

      // Check if it overflows bottom viewport
      if (newTop + panelHeight > window.innerHeight - POPOVER_MARGIN) {
        // console.log("Flipping to above (Topbar)");
        newTop = "auto"; // Reset top
        newBottom = window.innerHeight - buttonRect.top + POPOVER_MARGIN; // Position above instead
      }

      // Prevent horizontal overflow
      if (newLeft < POPOVER_MARGIN) {
        // console.log("Adjusting left (Topbar - left overflow)");
        newLeft = POPOVER_MARGIN; // Align to left viewport edge
      }
      // Check right overflow (less common for right-align but possible if button itself is clipped)
      if (newLeft + panelWidth > window.innerWidth - POPOVER_MARGIN) {
        // console.log("Adjusting left (Topbar - right overflow)");
        newLeft = window.innerWidth - panelWidth - POPOVER_MARGIN; // Align to right viewport edge
      }
    }

    setPopoverPosition({
      top: typeof newTop === "number" ? `${newTop}px` : newTop,
      left: typeof newLeft === "number" ? `${newLeft}px` : newLeft,
      bottom: typeof newBottom === "number" ? `${newBottom}px` : newBottom,
      opacity: 1, // Make visible after positioning
    });
  }, [isSidebar]); // Dependency ensures recalculation if position prop changes

  // Debounced version for resize/scroll
  const debouncedUpdatePosition = useCallback(
    debounce(calculateAndSetPosition, 50),
    [calculateAndSetPosition]
  );

  // --- Hover/Focus Logic ---
  const openPopover = useCallback(() => {
    // Clear any pending close timer
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Only trigger state update and position calculation if not already open
    if (!isHoverPopoverOpen) {
      setIsHoverPopoverOpen(true);
      // Calculate position slightly after state update allows panel to render (via static + Transition)
      // Using RAF ensures it happens before the next paint
      requestAnimationFrame(() => {
        calculateAndSetPosition();
      });
    }
  }, [isHoverPopoverOpen, calculateAndSetPosition]);

  const closePopover = useCallback(() => {
    // Clear any existing timer (safety)
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // Set a timer to close the popover
    closeTimeoutRef.current = setTimeout(() => {
      setIsHoverPopoverOpen(false);
      // Reset opacity immediately before transition leave for smoother visual
      setPopoverPosition((pos) => ({ ...pos, opacity: 0 }));
    }, HOVER_CLOSE_DELAY);
  }, []);

  // --- Event Listener Management for Resize/Scroll ---
  const addListeners = useCallback(() => {
    // console.log("Adding listeners");
    window.addEventListener("resize", debouncedUpdatePosition);
    // Use document capture phase for scroll to catch scrolling within containers too
    document.addEventListener("scroll", debouncedUpdatePosition, true);
  }, [debouncedUpdatePosition]);

  const removeListeners = useCallback(() => {
    // console.log("Removing listeners");
    window.removeEventListener("resize", debouncedUpdatePosition);
    document.removeEventListener("scroll", debouncedUpdatePosition, true);
    debouncedUpdatePosition.cancel?.(); // Cancel any pending debounced calls
  }, [debouncedUpdatePosition]);

  // --- Effect for Cleanup ---
  useEffect(() => {
    // Cleanup timeout and listeners on component unmount
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      removeListeners(); // Ensure listeners are removed
    };
  }, [removeListeners]); // Run cleanup only if removeListeners changes (which it shouldn't often)

  // --- Render ---
  return (
    <Popover
      as="div"
      className={classNames(
        // Use classNames for conditional styling
        "flex items-center",
        isSidebar ? "relative w-full" : "relative h-9"
      )}
    >
      {/* Wrapper div for hover/focus triggers */}
      <div
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
        onFocus={openPopover} // Open when button receives focus
        onBlur={closePopover} // Close when focus leaves the trigger area *and* the panel (handled below)
        className="w-full"
      >
        {isCollapsed && isSidebar ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover.Button
                ref={buttonRef}
                id={buttonId}
                className="group flex h-9 w-9 items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75"
              >
                {session?.user?.image ? (
                  <div className="h-6 w-6 overflow-hidden rounded-full ring-1 ring-gray-300 dark:ring-gray-600">
                    <Image
                      src={session.user.image}
                      alt="User profile" // More specific alt text if name is available
                      width={24}
                      height={24}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                )}
                <span className="sr-only">Open user menu</span>
              </Popover.Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              <p>User Menu</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Popover.Button
            ref={buttonRef}
            id={buttonId}
            className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75"
          >
            {/* Button Content (Non-collapsed) */}
            <div className="flex w-full items-center pointer-events-none">
              {" "}
              {/* pointer-events-none prevents children stealing hover */}
              <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center">
                {session?.user?.image ? (
                  <div className="h-full w-full overflow-hidden rounded-full ring-1 ring-gray-300 dark:ring-gray-600">
                    <Image
                      src={session.user.image}
                      alt="User profile"
                      width={24}
                      height={24}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                )}
              </div>
              <div
                className={classNames(
                  "flex-1 text-left transition-opacity duration-300",
                  isCollapsed && isSidebar ? "opacity-0 w-0" : "opacity-100" // Hide text when collapsed
                )}
              >
                <span className="block truncate text-gray-900 dark:text-gray-100">
                  {session?.user?.name || session?.user?.email || "User"}
                </span>
              </div>
            </div>
          </Popover.Button>
        )}
      </div>

      {/* Portal for Popover Panel */}
      {typeof document !== "undefined" &&
        createPortal(
          <Transition
            as={Fragment}
            show={isHoverPopoverOpen} // Controlled by our hover state
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            // Add/Remove listeners based on transition state
            afterEnter={() => {
              calculateAndSetPosition(); // Ensure position is correct after entering
              addListeners();
            }}
            beforeLeave={removeListeners}
          >
            <Popover.Panel
              ref={popoverPanelRef}
              static // Keep in DOM for ref and measurement
              onMouseEnter={openPopover} // Keep open if mouse enters panel
              onMouseLeave={closePopover} // Start close timer if mouse leaves panel
              // Keep panel open if focus moves within it
              onFocus={openPopover}
              // Close panel if focus moves outside the panel (e.g., tabbing away)
              onBlur={(e) => {
                // Check if the new focused element is *outside* the panel
                if (
                  !popoverPanelRef.current?.contains(e.relatedTarget as Node)
                ) {
                  closePopover();
                }
              }}
              className={classNames(
                "fixed z-50 rounded-lg bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-white/10",
                POPOVER_WIDTH_CLASS, // Apply width class
                popoverPosition.bottom !== "auto"
                  ? "origin-bottom"
                  : "origin-top" // Adjust origin based on calculated position
              )}
              style={{
                top: popoverPosition.top,
                left: popoverPosition.left,
                bottom: popoverPosition.bottom,
                opacity: popoverPosition.opacity, // Control visibility via state for smooth appear
                transition: "opacity 100ms ease-out", // Add transition for opacity
              }}
            >
              {/* Panel Content */}
              <div className="flex flex-col space-y-1">
                {" "}
                {/* Reduced space-y */}
                {/* User Info */}
                <div className="border-b border-gray-200 px-1 pb-3 mb-2 dark:border-gray-700">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                    {session?.user?.email || ""}
                  </p>
                  {session?.user?.role && (
                    <div className="mt-2">
                      <RoleBadge
                        role={session.user.role}
                        isEmployee={!!session.user.isEmployee}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
                {/* Links */}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsHoverPopoverOpen(false)} // Close on click
                  className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
                >
                  <UserIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-500 dark:text-gray-500 dark:group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                  Profil
                </Link>
                <Link
                  href="/dashboard/settings/account"
                  onClick={() => setIsHoverPopoverOpen(false)}
                  className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
                >
                  <Cog6ToothIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-500 dark:text-gray-500 dark:group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                  Pengaturan
                </Link>
                {session?.user?.role === Role.OWNER && (
                  <Link
                    href="/dashboard/settings/employees"
                    onClick={() => setIsHoverPopoverOpen(false)}
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
                  >
                    <UserGroupIcon
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-500 dark:text-gray-500 dark:group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                    Karyawan
                  </Link>
                )}
                {session?.user?.role === Role.OWNER && (
                  <Link
                    href="/dashboard/billing"
                    onClick={() => setIsHoverPopoverOpen(false)}
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
                  >
                    <ReceiptRefundIcon
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-500 dark:text-gray-500 dark:group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                    Tagihan
                  </Link>
                )}
                {/* Logout Button */}
                <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsHoverPopoverOpen(false);
                    }}
                    disabled={isPending}
                    className="group flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-400"
                  >
                    <ArrowRightOnRectangleIcon
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 dark:text-gray-500 dark:group-hover:text-red-400"
                      aria-hidden="true"
                    />
                    {isPending ? "Logging out..." : "Keluar"}
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Transition>,
          document.body // Render portal into body
        )}
    </Popover>
  );
};

export default UserProfileMenu;

// Make sure classNames utility is defined:
// export function classNames(...classes: (string | undefined | null | false)[]) {
//   return classes.filter(Boolean).join(' ');
// }
