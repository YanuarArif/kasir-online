// components/Layout/DashboardLayout.tsx
"use client";
import React, { useState, Fragment, type ReactNode } from "react";
import Link from "next/link";
import { Transition, Dialog } from "@headlessui/react"; // For smooth mobile sidebar transitions
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  CubeIcon, // Example for Products
  Cog6ToothIcon, // Example for Settings
  CurrencyDollarIcon, // Example for Sales/Transactions
} from "@heroicons/react/24/outline";
import Image from "next/image"; // Assuming you might want a logo

interface DashboardLayoutProps {
  children: ReactNode; // To render the page content
  pageTitle?: string; // Optional title for the header
}

// Define your navigation items
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true }, // Example: Mark current page
  {
    name: "Penjualan",
    href: "/dashboard/sales",
    icon: CurrencyDollarIcon,
    current: false,
  },
  {
    name: "Produk",
    href: "/dashboard/products",
    icon: CubeIcon,
    current: false,
  },
  {
    name: "Laporan",
    href: "/dashboard/reports",
    icon: ChartBarIcon,
    current: false,
  },
  {
    name: "Pengaturan",
    href: "/dashboard/settings",
    icon: Cog6ToothIcon,
    current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  pageTitle = "Dashboard",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Full container */}
      <div className="min-h-screen flex bg-gray-100">
        {/* Mobile Sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            {/* Overlay */}
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            {/* Sidebar Content */}
            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pb-4 pt-5">
                  {/* Close button */}
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Tutup sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  {/* Logo (Mobile) */}
                  <div className="flex flex-shrink-0 items-center px-4">
                    {/* Replace with your actual logo */}
                    <span className="text-white text-xl font-semibold">
                      Kasir Online
                    </span>
                    {/* Example using next/image: */}
                    {/* <Image src="/logo-white.png" alt="Kasir Online Logo" width={150} height={40} /> */}
                  </div>

                  {/* Navigation (Mobile) */}
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                          onClick={() => setSidebarOpen(false)} // Close sidebar on navigation
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-gray-300"
                                : "text-gray-400 group-hover:text-gray-300",
                              "mr-4 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static Sidebar for Desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto bg-gray-800 pt-5">
            {/* Logo (Desktop) */}
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-white text-xl font-semibold">
                Kasir Online
              </span>
              {/* <Image src="/logo-white.png" alt="Kasir Online Logo" width={160} height={45} /> */}
            </div>
            {/* Navigation (Desktop) */}
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-300"
                          : "text-gray-400 group-hover:text-gray-300",
                        "mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col md:pl-64">
          {" "}
          {/* Add padding-left matching sidebar width on desktop */}
          {/* Header Bar (Mobile Menu Button + Page Title) */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Buka sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Header Content (e.g., Page Title, User Menu) */}
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1 items-center">
                {/* Page Title */}
                <h1 className="text-xl font-semibold text-gray-900">
                  {pageTitle}
                </h1>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Placeholder for User Profile Dropdown, Notifications, etc. */}
                <div className="relative ml-3">
                  <div>
                    <button
                      type="button"
                      className="flex max-w-xs items-center rounded-full bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-1"
                    >
                      <span className="sr-only">Buka menu pengguna</span>
                      {/* Replace with User Avatar */}
                      <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    </button>
                  </div>
                  {/* Add Dropdown Menu Here if needed using Headless UI Menu component */}
                </div>
              </div>
            </div>
          </div>
          {/* Page Specific Content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {/* Content goes here */}
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
