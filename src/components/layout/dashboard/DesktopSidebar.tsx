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
        "hidden md:flex md:flex-col transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden",
        isCollapsed ? "md:w-16" : "md:w-64" // Width depends on state
      )}
    >
      {/* Sidebar component */}
      <div className="flex min-h-0 flex-1 flex-col bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/50 z-10">
        {/* Toggle Button */}
        <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
          <button
            onClick={toggleCollapse}
            className={classNames(
              "flex justify-center items-center h-8 w-8 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
              isCollapsed ? "mx-auto" : ""
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-1 flex-col overflow-y-auto hide-scrollbar">
          <SidebarNavigation isCollapsed={isCollapsed} />
        </div>

        {/* User Profile Section at Bottom */}
        <div
          className={classNames(
            "flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900",
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
