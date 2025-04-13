"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import MobileSidebar from "./dashboard/MobileSidebar";
import DesktopSidebar from "./dashboard/DesktopSidebar";
import DashboardNavbar from "./dashboard/DashboardNavbar";
import { classNames } from "./dashboard/SidebarNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const LG_BREAKPOINT = 1024; // Tailwind's default lg breakpoint

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  pageTitle = "Dashboard",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean | undefined>(
    undefined
  ); // Initially undefined for SSR/hydration safety
  // We track if user explicitly toggled the sidebar
  const [, setIsManuallyToggled] = useState(false);

  // Effect 1: Initialize state based on screen size and localStorage on client-side mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    const initialIsLargeScreen = window.innerWidth >= LG_BREAKPOINT;

    if (savedState !== null) {
      // If there's a saved state, use it initially
      setIsCollapsed(JSON.parse(savedState));
      // Assume manual toggle if saved state conflicts with screen size default
      setIsManuallyToggled(JSON.parse(savedState) === !initialIsLargeScreen);
    } else {
      // No saved state, set initial based on screen size
      setIsCollapsed(!initialIsLargeScreen); // Collapse if screen is < lg
    }
  }, []); // Run only once on mount

  // Effect 2: Listen for screen size changes and update state automatically *if not manually toggled*
  useEffect(() => {
    // Ensure window is defined (runs only on client)
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);

    const handleResize = (event: MediaQueryListEvent) => {
      // Only auto-update if the user hasn't manually toggled recently
      // Or, simpler: let resize always dictate the default, manual toggle overrides until next resize change
      setIsCollapsed(!event.matches); // Collapse if screen is < lg
      setIsManuallyToggled(false); // Reset manual toggle on resize change
    };

    // Add listener using the modern method which includes the event object
    mediaQuery.addEventListener("change", handleResize);

    // Cleanup: remove listener when component unmounts
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []); // Run only once on mount to set up listener

  // Effect 3: Save collapsed state to localStorage when it changes
  useEffect(() => {
    // Only save if the state is defined (initialized)
    if (isCollapsed !== undefined) {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]); // Run whenever isCollapsed changes

  // Manual toggle function
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      // When manually toggling, update localStorage immediately via the state change + Effect 3
      // Also mark that it was manually toggled
      setIsManuallyToggled(true);
      return newState;
    });
  };

  // --- Render Guard ---
  // Don't render the sidebar structure until isCollapsed is determined on the client
  if (isCollapsed === undefined) {
    // Render a basic layout shell or null/loading indicator
    return null; // Or a loading skeleton
  }
  // --- End Render Guard ---

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Dashboard Navbar - Full width at top */}
      <DashboardNavbar pageTitle={pageTitle} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Sidebar */}
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Desktop Sidebar - Now under the navbar */}
        <DesktopSidebar
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />

        {/* Main Content */}
        <div
          className={classNames(
            "flex flex-1 flex-col transition-all duration-300 overflow-y-auto",
            isCollapsed ? "md:ml-16" : "md:ml-64" // Adjust left margin instead of padding
          )}
        >
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
