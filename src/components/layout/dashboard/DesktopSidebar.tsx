"use client";

import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import SidebarNavigation, { classNames } from "./SidebarNavigation";
import SidebarUserProfile from "./SidebarUserProfile";
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
        "hidden shadow-md md:flex md:flex-col transition-all duration-300 ease-in-out h-[calc(100vh-4rem)] fixed top-16 overflow-hidden z-20",
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
                      className="group flex items-center rounded-md px-1 py-2 text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer w-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      aria-label="Perluas Menu"
                    >
                      {/* Icon container - always fixed width */}
                      <div className="w-6 flex-shrink-0 flex justify-center">
                        <ChevronLeftIcon
                          className="h-6 w-6 transition-all duration-500 ease-in-out transform rotate-180"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Hidden text container */}
                      <div className="opacity-0 w-0 overflow-hidden ml-3">
                        <span className="truncate">Perluas Menu</span>
                      </div>
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
                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer w-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                aria-label="Perkecil Menu"
              >
                {/* Icon container - always fixed width */}
                <div className="w-6 flex-shrink-0 flex justify-center">
                  <ChevronLeftIcon
                    className="h-6 w-6 transition-all duration-500 ease-in-out transform rotate-0"
                    aria-hidden="true"
                  />
                </div>

                {/* Text container */}
                <div className="ml-3 flex-1 transition-all duration-300 ease-in-out">
                  <span className="truncate">Perkecil Menu</span>
                </div>
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
          <SidebarUserProfile isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
