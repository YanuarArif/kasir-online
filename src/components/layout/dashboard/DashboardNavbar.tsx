"use client";

import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import UserProfileMenu from "./UserProfileMenu";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { RoleBadge } from "@/components/ui/role-badge";
import { Bars3Icon } from "@heroicons/react/24/outline";
import AddMenu from "./AddMenu";
import ActivityMenu from "./ActivityMenu";
import NotificationMenu from "./NotificationMenu";

interface DashboardNavbarProps {
  pageTitle: string;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  pageTitle,
  setSidebarOpen,
}) => {
  const { data: session } = useSession();
  const userRole = session?.user?.role as Role | undefined;

  return (
    <div className="sticky top-0 z-30 w-full flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 drop-shadow-sm dark:shadow-gray-900/50 border-b border-gray-200 dark:border-gray-700">
      {/* Logo Section */}
      <div className="hidden md:flex items-center justify-center px-4 w-52 border-r border-gray-200 dark:border-gray-700">
        <span className="text-gray-900 dark:text-white text-xl font-semibold hidden md:block text-center">
          Kasir Online
        </span>
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="border-r border-gray-200 dark:border-gray-700 px-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Buka sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 justify-between px-4">
        <div className="flex flex-1 items-center">
          <h1 className="text-sm md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {pageTitle}
          </h1>

          {/* Role Badge */}
          {userRole && (
            <div className="ml-4 hidden md:flex items-center">
              <RoleBadge
                role={userRole}
                isEmployee={!!session?.user?.isEmployee}
                size="md"
              />
            </div>
          )}
        </div>

        {/* Action Icons, Theme Toggle, and User Menu */}
        <div className="ml-4 flex items-center space-x-2 md:ml-6">
          {/* Add Menu */}
          <AddMenu />

          {/* Activity Menu */}
          <ActivityMenu />

          {/* Notification Menu */}
          <NotificationMenu />

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* User Menu */}
          <div className="m-3">
            <UserProfileMenu position="topbar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
