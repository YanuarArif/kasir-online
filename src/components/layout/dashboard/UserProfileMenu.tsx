"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { logout } from "@/actions/logout";
import {
  UserIcon,
  Cog6ToothIcon,
  ReceiptRefundIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { classNames } from "./SidebarNavigation";

interface UserProfileMenuProps {
  isCollapsed?: boolean;
  position?: "sidebar" | "topbar";
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  isCollapsed = false,
  position = "sidebar",
}) => {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  const isSidebar = position === "sidebar";
  const isTopbar = position === "topbar";

  return (
    <Menu as="div" className={isSidebar ? "relative flex flex-row items-center w-full" : "relative ml-3"}>
      {/* User Avatar Button */}
      <div>
        {isCollapsed && isSidebar ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Menu.Button className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full">
                <span className="sr-only">Open user menu</span>
                {session?.user?.image ? (
                  <div className="inline-block h-9 w-9 overflow-hidden rounded-full bg-gray-600 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-500 ring-opacity-50">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User profile"}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-600 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-500 ring-opacity-50">
                    <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                  </span>
                )}
              </Menu.Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              <p>User Menu</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Menu.Button 
            className={classNames(
              "flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
              isSidebar 
                ? "focus:ring-offset-gray-800 rounded-full" 
                : "rounded-full bg-white dark:bg-gray-700 border-2 border-indigo-100 dark:border-gray-600 p-0.5 shadow-sm hover:shadow transition-all duration-200"
            )}
          >
            <span className="sr-only">Open user menu</span>
            {session?.user?.image ? (
              <div className={classNames(
                "inline-block h-9 w-9 overflow-hidden rounded-full",
                isSidebar ? "bg-gray-600 ring-2 ring-white ring-opacity-50" : "bg-gray-100"
              )}>
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User profile"}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <span className={classNames(
                "inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full",
                isSidebar ? "bg-gray-600 ring-2 ring-white ring-opacity-50" : "bg-indigo-50"
              )}>
                <UserIcon className={classNames(
                  "h-6 w-6",
                  isSidebar ? "text-gray-400" : "text-indigo-300"
                )} />
              </span>
            )}
          </Menu.Button>
        )}
      </div>

      {/* Name/Email (only when expanded in sidebar) */}
      {!isCollapsed && isSidebar && (
        <div className="min-w-0 flex-1 ml-3 flex flex-col justify-center">
          <p className="text-sm font-medium text-white dark:text-gray-100 truncate leading-tight">
            {session?.user?.name || session?.user?.email || "User"}
          </p>
          {/* Optionally show email if different from name */}
          {session?.user?.email &&
            session.user.name &&
            session.user.email !== session.user.name && (
              <p className="text-xs font-medium text-gray-400 dark:text-gray-300 truncate mt-0.5 leading-tight">
                {session?.user?.email}
              </p>
            )}
        </div>
      )}

      {/* Dropdown Menu */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          className={classNames(
            "absolute z-20 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700",
            isSidebar ? "bottom-full left-0 mb-2 origin-bottom-left" : "right-0 mt-2"
          )}
        >
          {/* User info section */}
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {session?.user?.name || session?.user?.email || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
              {session?.user?.email || ""}
            </p>
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
                  {isSidebar ? "Lihat Profil" : "Profil"}
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
                  {isSidebar ? "Pengaturan Akun" : "Pengaturan"}
                </Link>
              )}
            </Menu.Item>
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
                  {isSidebar ? "Billing" : "Tagihan"}
                </Link>
              )}
            </Menu.Item>
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
                  {isPending ? "Logging out..." : isSidebar ? "Logout" : "Keluar"}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserProfileMenu;
