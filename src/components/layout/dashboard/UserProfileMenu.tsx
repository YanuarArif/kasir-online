"use client";

import React, {
  Fragment,
  useRef,
  useState,
  useCallback,
  useTransition,
  useEffect,
  useId, // Import useId directly
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

// Helper debounce function (no changes needed here)
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

interface UserProfileMenuProps {
  isCollapsed?: boolean;
  position?: "sidebar" | "topbar";
}

// --- Constants ---
const MENU_WIDTH_PX = 224;
const MENU_MARGIN = 8;
const HOVER_CLOSE_DELAY = 150;

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
    opacity: 0,
  });
  const [isHoverMenuOpen, setIsHoverMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Hooks ---
  const buttonId = useId(); // Call useId unconditionally at the top level

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  const isSidebar = position === "sidebar";

  // --- Positioning Logic ---
  const calculateAndSetPosition = useCallback(() => {
    if (!buttonRef.current || !menuItemsRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = menuItemsRef.current.offsetHeight || 250;
    let newTop: string | number = "auto";
    let newLeft: string | number = "auto";
    let newBottom: string | number = "auto";

    if (isSidebar) {
      newBottom = window.innerHeight - rect.top + MENU_MARGIN;
      newLeft = rect.left;
      if (
        window.innerHeight - (newBottom as number) - menuHeight <
        MENU_MARGIN
      ) {
        newBottom = "auto";
        newTop = rect.bottom + MENU_MARGIN;
      }
      if (newLeft < MENU_MARGIN) newLeft = MENU_MARGIN;
      if (newLeft + MENU_WIDTH_PX > window.innerWidth - MENU_MARGIN) {
        newLeft = window.innerWidth - MENU_WIDTH_PX - MENU_MARGIN;
      }
    } else {
      newTop = rect.bottom + MENU_MARGIN;
      newLeft = rect.right - MENU_WIDTH_PX;
      if (newTop + menuHeight > window.innerHeight - MENU_MARGIN) {
        newBottom = window.innerHeight - rect.top + MENU_MARGIN;
        newTop = "auto";
      }
      if (newLeft < MENU_MARGIN) newLeft = MENU_MARGIN;
      if (newLeft + MENU_WIDTH_PX > window.innerWidth - MENU_MARGIN) {
        newLeft = rect.left;
      }
    }

    setMenuPosition({
      top: typeof newTop === "number" ? `${newTop}px` : newTop,
      left: typeof newLeft === "number" ? `${newLeft}px` : newLeft,
      bottom: typeof newBottom === "number" ? `${newBottom}px` : newBottom,
      opacity: 1,
    });
  }, [isSidebar]);

  const debouncedUpdatePosition = useCallback(
    debounce(calculateAndSetPosition, 50),
    [calculateAndSetPosition]
  );

  // --- Hover Logic ---
  const openMenu = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (!isHoverMenuOpen) {
      setIsHoverMenuOpen(true);
      requestAnimationFrame(() => {
        if (menuItemsRef.current) {
          calculateAndSetPosition();
        }
      });
    }
  }, [calculateAndSetPosition, isHoverMenuOpen]);

  const closeMenu = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsHoverMenuOpen(false);
    }, HOVER_CLOSE_DELAY);
  }, []);

  // --- Event Listener Management ---
  const addListeners = useCallback(() => {
    window.addEventListener("resize", debouncedUpdatePosition);
    document.addEventListener("scroll", debouncedUpdatePosition, true);
  }, [debouncedUpdatePosition]);

  const removeListeners = useCallback(() => {
    window.removeEventListener("resize", debouncedUpdatePosition);
    document.removeEventListener("scroll", debouncedUpdatePosition, true);
    debouncedUpdatePosition.cancel?.();
  }, [debouncedUpdatePosition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      removeListeners();
    };
  }, [removeListeners]);

  return (
    <Menu
      as="div"
      className={
        isSidebar
          ? "relative flex flex-row items-center w-full"
          : "relative flex items-center h-9"
      }
    >
      {/* Trigger Area */}
      <div
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
        onFocus={openMenu}
        onBlur={closeMenu}
        className="w-full"
      >
        {isCollapsed && isSidebar ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Menu.Button
                ref={buttonRef}
                id={buttonId} // Use the generated ID
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
            id={buttonId} // Use the generated ID
            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer w-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
          >
            <div className="flex items-center w-full pointer-events-none">
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
                    ? "opacity-0 w-0 overflow-hidden"
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
      </div>

      {/* Dropdown Menu Portal */}
      {typeof document !== "undefined" &&
        createPortal(
          <Transition
            as={Fragment}
            show={isHoverMenuOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            afterEnter={addListeners}
            beforeLeave={removeListeners}
          >
            <Menu.Items
              ref={menuItemsRef}
              static
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
              onFocus={openMenu}
              onBlur={closeMenu}
              className={classNames(
                "fixed z-50 w-56 rounded-lg bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700",
                menuPosition.bottom !== "auto"
                  ? "origin-bottom-left"
                  : "origin-top-right"
              )}
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                bottom: menuPosition.bottom,
                opacity: menuPosition.opacity,
              }}
              // Headless UI links Menu.Items aria-labelledby to the Menu.Button's id
            >
              {/* User info section */}
              <div className="px-4 py-3 pointer-events-none">
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

              {/* Menu items structure */}
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/dashboard/profile"
                      className={classNames(
                        active ? "bg-gray-50 dark:bg-gray-700" : "",
                        "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                      )}
                      onClick={() => setIsHoverMenuOpen(false)}
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
                      onClick={() => setIsHoverMenuOpen(false)}
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
                        onClick={() => setIsHoverMenuOpen(false)}
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
                        onClick={() => setIsHoverMenuOpen(false)}
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
                      onClick={() => {
                        handleLogout();
                        setIsHoverMenuOpen(false);
                      }}
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
          document.body
        )}
    </Menu>
  );
};

export default UserProfileMenu;
