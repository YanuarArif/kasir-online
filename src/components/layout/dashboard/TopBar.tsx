"use client";

import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ThemeToggle } from "@/components/theme-toggle";
import UserProfileMenu from "./UserProfileMenu";

interface TopBarProps {
  pageTitle: string;
  setSidebarOpen: (open: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ pageTitle, setSidebarOpen }) => {
  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow">
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="border-r border-gray-200 dark:border-gray-700 px-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Buka sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      {/* End Mobile Menu Button */}

      <div className="flex flex-1 justify-between px-4">
        <div className="flex flex-1 items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {pageTitle}
          </h1>
        </div>
        {/* User Menu and Theme Toggle */}
        <div className="ml-4 flex items-center md:ml-6">
          {/* Theme Toggle Button */}
          <div className="mr-3">
            <ThemeToggle />
          </div>

          {/* User Menu */}
          <UserProfileMenu position="topbar" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
