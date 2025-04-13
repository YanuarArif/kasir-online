"use client";

import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
  // Prevent body scroll when sidebar is open and handle transitions
  useEffect(() => {
    if (sidebarOpen) {
      // Lock body scroll when sidebar is open
      document.body.style.overflow = "hidden";

      // Add a class to the body to prevent any potential layout shifts
      document.body.classList.add("sidebar-open");
    } else {
      // Small delay to ensure animations complete before unlocking scroll
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.classList.remove("sidebar-open");
      }, 500); // Match this with the transition duration

      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("sidebar-open");
    };
  }, [sidebarOpen]);
  return (
    <Transition.Root show={sidebarOpen} as={Fragment} appear={true}>
      <Dialog
        as="div"
        className="relative z-40 md:hidden"
        onClose={() => {
          // Use a controlled close to ensure animations complete
          setSidebarOpen(false);
        }}
        static
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex will-change-transform h-full">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-500 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-100 dark:bg-gray-800 pb-4 pt-5 shadow-xl dark:shadow-gray-900/50 h-screen will-change-transform overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute right-0 top-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:focus:ring-gray-500 transition-colors duration-200"
                    onClick={() => {
                      // Use controlled close to ensure animations complete
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-gray-600 dark:text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex flex-shrink-0 items-center px-4">
                <span className="text-gray-900 dark:text-white text-xl font-semibold">
                  Kasir Online
                </span>
              </div>
              <div className="mt-5 flex-1 overflow-y-auto thin-scrollbar">
                <SidebarNavigation
                  isCollapsed={false}
                  onItemClick={() => {
                    // Use controlled close to ensure animations complete
                    setSidebarOpen(false);
                  }}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MobileSidebar;
