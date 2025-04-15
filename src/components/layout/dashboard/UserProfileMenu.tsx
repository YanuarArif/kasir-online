"use client";

import React, {
  Fragment,
  useRef,
  useState,
  useCallback,
  useTransition,
  useEffect, // Keep top-level useEffect if needed for other things, but not for this specific task
} from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
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

// Helper debounce function (consider using lodash/debounce if available)
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  // Add a cleanup function to the debounced function itself
  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

interface UserProfileMenuProps {
  isCollapsed?: boolean;
  position?: "sidebar" | "topbar";
}

// --- Constants ---
const MENU_WIDTH_PX = 224; // Tailwind w-56 = 14rem = 224px
const MENU_MARGIN = 8; // Space between button and menu

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  isCollapsed = false,
  position = "sidebar",
}) => {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const [menuPosition, setMenuPosition] = useState({
    top: "auto",
    left: "auto",
    bottom: "auto",
    opacity: 0, // Start hidden for portal positioning
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null); // Ref for the menu itself

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  const isSidebar = position === "sidebar";

  // Debounced position update function
  const debouncedUpdatePosition = useCallback(
    debounce(() => {
      if (!buttonRef.current || !menuItemsRef.current) return; // Ensure refs are valid

      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuItemsRef.current.offsetHeight;
      let newTop: string | number = "auto";
      let newLeft: string | number = "auto";
      let newBottom: string | number = "auto";

      if (isSidebar) {
        // Position menu *above* the button in the sidebar
        newBottom = window.innerHeight - rect.top + MENU_MARGIN;
        newLeft = rect.left;

        // Adjust if menu would go off screen top
        if (
          window.innerHeight - (newBottom as number) - menuHeight <
          MENU_MARGIN
        ) {
          newBottom = "auto";
          newTop = rect.bottom + MENU_MARGIN; // Fallback to below button
        }

        // Prevent left/right overflow
        if (newLeft < MENU_MARGIN) newLeft = MENU_MARGIN;
        if (newLeft + MENU_WIDTH_PX > window.innerWidth - MENU_MARGIN) {
          newLeft = window.innerWidth - MENU_WIDTH_PX - MENU_MARGIN;
        }
      } else {
        // Position menu *below* the button in the topbar
        newTop = rect.bottom + MENU_MARGIN;
        newLeft = rect.right - MENU_WIDTH_PX;

        // Check if menu overflows vertically downwards
        if (newTop + menuHeight > window.innerHeight - MENU_MARGIN) {
          // Flip to open upwards
          newBottom = window.innerHeight - rect.top + MENU_MARGIN;
          newTop = "auto";
        }

        // Prevent left/right overflow
        if (newLeft < MENU_MARGIN) newLeft = MENU_MARGIN;
        if (newLeft + MENU_WIDTH_PX > window.innerWidth - MENU_MARGIN) {
          // This case usually means aligning left is better for topbar
          newLeft = rect.left;
        }
      }

      setMenuPosition({
        top: typeof newTop === "number" ? `${newTop}px` : newTop,
        left: typeof newLeft === "number" ? `${newLeft}px` : newLeft,
        bottom: typeof newBottom === "number" ? `${newBottom}px` : newBottom,
        opacity: 1, // Make visible after positioning
      });
    }, 100), // Debounce wait time
    [isSidebar] // Dependency: update logic changes based on position prop
  );

  // Function to add listeners
  const addListeners = useCallback(() => {
    window.addEventListener("resize", debouncedUpdatePosition);
    // Listen on document for scroll events in case the scroll container isn't window
    document.addEventListener("scroll", debouncedUpdatePosition, true);
  }, [debouncedUpdatePosition]);

  // Function to remove listeners
  const removeListeners = useCallback(() => {
    window.removeEventListener("resize", debouncedUpdatePosition);
    document.removeEventListener("scroll", debouncedUpdatePosition, true);
    // Cancel any pending debounced calls
    debouncedUpdatePosition.cancel?.();
  }, [debouncedUpdatePosition]);

  return (
    <Menu
      as="div"
      className={
        isSidebar
          ? "relative flex flex-row items-center w-full"
          : "relative flex items-center h-9" // Keep button contained
      }
    >
      {({ open }) => (
        <>
          {/* User Avatar Button */}
          {isCollapsed && isSidebar ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Menu.Button
                  ref={buttonRef}
                  className="group flex items-center justify-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer w-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                >
                  <div className="w-6 h-6 flex-shrink-0 flex justify-center items-center">
                    {session?.user?.image ? (
                      <div className="inline-block h-6 w-6 overflow-hidden rounded-full bg-gray-600 dark:bg-gray-700 ring-1 ring-white dark:ring-gray-500 ring-opacity-50">
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User profile"}
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                    )}
                  </div>
                  <span className="sr-only">Open user menu</span>
                </Menu.Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>User Menu</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Menu.Button
              ref={buttonRef}
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer w-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            >
              <div className="flex items-center w-full">
                <div className="w-6 h-6 flex-shrink-0 flex justify-center items-center">
                  {session?.user?.image ? (
                    <div className="inline-block h-6 w-6 overflow-hidden rounded-full bg-gray-600 dark:bg-gray-700 ring-1 ring-white dark:ring-gray-500 ring-opacity-50">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User profile"}
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
                    "ml-3 flex-1 transition-opacity duration-300 ease-in-out",
                    isCollapsed && isSidebar
                      ? "opacity-0 w-0 overflow-hidden pointer-events-none"
                      : "opacity-100"
                  )}
                >
                  <span className="truncate block">
                    {session?.user?.name || session?.user?.email || "User"}
                  </span>
                </div>
              </div>
            </Menu.Button>
          )}

          {/* Dropdown Menu Portal */}
          {typeof document !== "undefined" &&
            createPortal(
              <Transition
                as={Fragment}
                show={open} // Use Headless UI state directly
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                // Use lifecycle hooks for positioning and listeners
                afterEnter={() => {
                  // Set initial position *after* menu is rendered and visible
                  debouncedUpdatePosition(); // Call directly first time
                  addListeners(); // Add listeners now that menu is open
                }}
                beforeLeave={() => {
                  removeListeners(); // Clean up listeners before menu disappears
                  setMenuPosition((pos) => ({ ...pos, opacity: 0 })); // Hide before removing from DOM
                }}
              >
                <Menu.Items
                  ref={menuItemsRef} // Ref for measurement
                  static // Keep in DOM for measurement and portal reasons
                  className={classNames(
                    "fixed z-50 w-56 rounded-lg bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700",
                    // Adjust origin based on where it likely opened from
                    menuPosition.bottom !== "auto"
                      ? "origin-bottom-left" // Opens upwards
                      : "origin-top-right" // Opens downwards (default)
                  )}
                  style={{
                    top: menuPosition.top,
                    left: menuPosition.left,
                    bottom: menuPosition.bottom,
                    opacity: menuPosition.opacity, // Control visibility via state
                    // Add transition for opacity for smoother appearance after positioning
                    transition: "opacity 0.1s ease-out",
                  }}
                >
                  {/* User info section */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                      {session?.user?.email || ""}
                    </p>
                    {session?.user?.role && (
                      <div className="mt-2 flex items-center">
                        <RoleBadge
                          role={session.user.role}
                          isEmployee={!!session.user.isEmployee}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard/profile"
                          className={classNames(
                            active ? "bg-gray-50 dark:bg-gray-700" : "",
                            "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                          )}
                        >
                          <UserIcon
                            className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                            aria-hidden="true"
                          />
                          Profil
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard/settings/account"
                          className={classNames(
                            active ? "bg-gray-50 dark:bg-gray-700" : "",
                            "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                          )}
                        >
                          <Cog6ToothIcon
                            className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                            aria-hidden="true"
                          />
                          Pengaturan
                        </Link>
                      )}
                    </Menu.Item>

                    {session?.user?.role === Role.OWNER && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/settings/employees"
                            className={classNames(
                              active ? "bg-gray-50 dark:bg-gray-700" : "",
                              "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            )}
                          >
                            <UserGroupIcon
                              className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                              aria-hidden="true"
                            />
                            Karyawan
                          </Link>
                        )}
                      </Menu.Item>
                    )}

                    {session?.user?.role === Role.OWNER && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/billing"
                            className={classNames(
                              active ? "bg-gray-50 dark:bg-gray-700" : "",
                              "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            )}
                          >
                            <ReceiptRefundIcon
                              className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                              aria-hidden="true"
                            />
                            Tagihan
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                  </div>

                  {/* Logout section */}
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          disabled={isPending}
                          className={classNames(
                            active ? "bg-gray-50 dark:bg-gray-700" : "",
                            "flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                          )}
                        >
                          <ArrowRightOnRectangleIcon
                            className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                            aria-hidden="true"
                          />
                          {isPending ? "Logging out..." : "Keluar"}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>,
              document.body // Target portal element
            )}
        </>
      )}
    </Menu>
  );
};

export default UserProfileMenu;

// Ensure classNames exists:
// export function classNames(...classes: (string | undefined | null | false)[]) {
//   return classes.filter(Boolean).join(' ');
// }
