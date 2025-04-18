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
import { Popover, Transition } from "@headlessui/react";
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
import { createPortal } from "react-dom";

// --- Debounce Utility ---
interface DebouncedFunction<F extends (...args: any[]) => any> {
  (...args: Parameters<F>): void;
  cancel: () => void;
}

function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): DebouncedFunction<F> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
  debounced.cancel = () => {
    if (timeout !== null) clearTimeout(timeout);
  };
  // Cast to the interface type to ensure TypeScript recognizes 'cancel'
  return debounced as DebouncedFunction<F>;
}

// --- Helper for conditional class names ---
export function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- Constants ---
const POPOVER_WIDTH_CLASS = "w-60"; // Tailwind class for width (240px)
const POPOVER_MARGIN = 8;
const HOVER_CLOSE_DELAY = 150;

// --- Component Props ---
interface SidebarUserProfileProps {
  isCollapsed?: boolean;
}

// --- Component ---
const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  isCollapsed = false,
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
      return;
    }

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const panelWidth = popoverPanelRef.current.offsetWidth || 240; // Fallback width
    const panelHeight = popoverPanelRef.current.offsetHeight || 300; // Fallback height

    // For sidebar, position to the right of the button
    let newTop: number | string = buttonRect.top;
    let newLeft: number | string = buttonRect.right + POPOVER_MARGIN;
    let newBottom: number | string = "auto";

    // If collapsed, position to the right
    if (isCollapsed) {
      // Adjust top to center with button if possible
      newTop = buttonRect.top + buttonRect.height / 2 - panelHeight / 2;
    } else {
      // If expanded, position below the button
      newTop = buttonRect.bottom + POPOVER_MARGIN;
      newLeft = buttonRect.left;
    }

    // Check top overflow
    if (newTop < POPOVER_MARGIN) {
      newTop = POPOVER_MARGIN;
    }

    // Check bottom overflow
    if (newTop + panelHeight > window.innerHeight - POPOVER_MARGIN) {
      // If not enough space below, position above
      if (isCollapsed) {
        // For collapsed sidebar, adjust top to fit
        newTop = window.innerHeight - panelHeight - POPOVER_MARGIN;
      } else {
        // For expanded sidebar, position above
        newTop = "auto";
        newBottom = window.innerHeight - buttonRect.top + POPOVER_MARGIN;
      }
    }

    // Check right overflow
    if (newLeft + panelWidth > window.innerWidth - POPOVER_MARGIN) {
      if (isCollapsed) {
        // For collapsed sidebar, position to the left of the button
        newLeft = buttonRect.left - panelWidth - POPOVER_MARGIN;
      } else {
        // For expanded sidebar, align right edge with window
        newLeft = window.innerWidth - panelWidth - POPOVER_MARGIN;
      }
    }

    setPopoverPosition({
      top: typeof newTop === "number" ? `${newTop}px` : newTop,
      left: typeof newLeft === "number" ? `${newLeft}px` : newLeft,
      bottom: typeof newBottom === "number" ? `${newBottom}px` : newBottom,
      opacity: 1, // Make visible after positioning
    });
  }, [isCollapsed]);

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
      // Calculate position slightly after state update allows panel to render
      requestAnimationFrame(() => {
        calculateAndSetPosition();
      });
    }
  }, [isHoverPopoverOpen, calculateAndSetPosition]);

  const closePopover = useCallback(() => {
    // Use a timeout to allow moving from button to panel
    closeTimeoutRef.current = setTimeout(() => {
      setIsHoverPopoverOpen(false);
    }, HOVER_CLOSE_DELAY);
  }, []);

  // --- Event Listeners ---
  const addListeners = useCallback(() => {
    window.addEventListener("resize", debouncedUpdatePosition);
    window.addEventListener("scroll", debouncedUpdatePosition, true);
  }, [debouncedUpdatePosition]);

  const removeListeners = useCallback(() => {
    window.removeEventListener("resize", debouncedUpdatePosition);
    window.removeEventListener("scroll", debouncedUpdatePosition, true);
    debouncedUpdatePosition.cancel();
  }, [debouncedUpdatePosition]);

  // --- Effect for Cleanup ---
  useEffect(() => {
    // Cleanup timeout and listeners on component unmount
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      removeListeners();
    };
  }, [removeListeners]);

  // --- Render ---
  return (
    <Popover
      as="div"
      className={classNames("flex items-center relative w-full")}
    >
      {/* Wrapper div for hover/focus triggers */}
      <div
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
        onFocus={openPopover}
        onBlur={closePopover}
        className="w-full"
      >
        {isCollapsed ? (
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
                      alt="User profile"
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
                  isCollapsed ? "opacity-0 w-0" : "opacity-100" // Hide text when collapsed
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
            show={isHoverPopoverOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            afterEnter={() => {
              calculateAndSetPosition();
              addListeners();
            }}
            beforeLeave={removeListeners}
          >
            <Popover.Panel
              ref={popoverPanelRef}
              static
              onMouseEnter={openPopover}
              onMouseLeave={closePopover}
              onFocus={openPopover}
              onBlur={(e) => {
                if (
                  !popoverPanelRef.current?.contains(e.relatedTarget as Node)
                ) {
                  closePopover();
                }
              }}
              className={`fixed z-50 rounded-lg bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-white/10 ${POPOVER_WIDTH_CLASS} ${
                popoverPosition.bottom !== "auto"
                  ? "origin-bottom"
                  : "origin-top"
              }`}
              style={{
                top: popoverPosition.top,
                left: popoverPosition.left,
                bottom: popoverPosition.bottom,
                opacity: popoverPosition.opacity,
                transition: "opacity 100ms ease-out",
              }}
            >
              {/* Panel Content */}
              <div className="flex flex-col space-y-1">
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
                  onClick={() => setIsHoverPopoverOpen(false)}
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
          document.body
        )}
    </Popover>
  );
};

export default SidebarUserProfile;
