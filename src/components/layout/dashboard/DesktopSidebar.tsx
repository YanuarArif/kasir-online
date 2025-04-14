"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SidebarNavigation, { classNames } from "./SidebarNavigation";
import UserProfileMenu from "./UserProfileMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        "hidden shadow-md md:flex md:flex-col transition-all duration-300 ease-in-out h-[calc(100vh-4rem)] sticky top-16 overflow-hidden",
        isCollapsed ? "md:w-16" : "md:w-52" // Width depends on state
      )}
    >
      {/* Sidebar component */}
      <div className="flex min-h-0 flex-1 flex-col bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/50 z-10">
        {/* Toggle Button */}
        <div className="flex h-12 flex-shrink-0 items-center border-b border-gray-200 dark:border-gray-700 px-4">
          <div className="w-full flex justify-end">
            {isCollapsed ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleCollapse}
                      className="relative flex justify-center items-center h-8 w-8 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                      aria-label="Perluas Menu"
                    >
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    <p>Perluas Menu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <button
                onClick={toggleCollapse}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                aria-label="Perkecil Menu"
              >
                <span className="text-sm font-medium">Perkecil Menu</span>
                <ChevronLeftIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-1 flex-col overflow-y-auto hide-scrollbar">
          <SidebarNavigation isCollapsed={isCollapsed} />
        </div>

        {/* User Profile Section at Bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out p-1">
          <UserProfileMenu isCollapsed={isCollapsed} position="sidebar" />
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
