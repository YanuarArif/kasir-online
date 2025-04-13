"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SidebarNavigation from "./SidebarNavigation";

interface MobileSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  // Simple function to close the sidebar
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-gray-600 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-gray-100 dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 z-40 md:hidden transform transition-transform duration-300 ease-in-out pb-4 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex flex-shrink-0 items-center px-4 pt-5">
          <span className="text-gray-900 dark:text-white text-xl font-semibold">
            Kasir Online
          </span>
        </div>

        {/* Navigation */}
        <div className="mt-5 flex-1 overflow-y-auto thin-scrollbar">
          <SidebarNavigation isCollapsed={false} onItemClick={closeSidebar} />
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
