"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SidebarNavigation, { classNames } from "./SidebarNavigation";
import UserProfileMenu from "./UserProfileMenu";

interface DesktopSidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isCollapsed,
  toggleCollapse,
}) => {
  return (
    <div
      className={classNames(
        "hidden md:fixed md:inset-y-0 md:flex md:flex-col transition-all duration-300",
        isCollapsed ? "md:w-16" : "md:w-64" // Width depends on state
      )}
    >
      {/* Sidebar component */}
      <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
        {/* Top Section: Logo and Toggle */}
        <div className="flex h-16 flex-shrink-0 items-center justify-between bg-gray-900 px-4">
          {!isCollapsed && (
            <span className="text-white text-xl font-semibold">
              Kasir Online
            </span>
          )}
          {/* Center toggle button if collapsed */}
          <button
            onClick={toggleCollapse}
            className={classNames(
              "flex justify-center items-center h-10 w-10 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
              isCollapsed ? "mx-auto" : ""
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        
        {/* Navigation Section */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <SidebarNavigation isCollapsed={isCollapsed} />
        </div>
        
        {/* User Profile Section at Bottom */}
        <div
          className={classNames(
            "flex-shrink-0 border-t border-gray-700 dark:border-gray-600 p-3 bg-gray-900 dark:bg-gray-800",
            isCollapsed ? "flex justify-center" : "flex items-center"
          )}
        >
          <UserProfileMenu isCollapsed={isCollapsed} position="sidebar" />
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
