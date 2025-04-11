"use client";
import React, { useState, useEffect, Fragment, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Transition, Dialog, Menu } from "@headlessui/react";
import { logout } from "@/actions/logout";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  TruckIcon,
  CubeIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  ReceiptRefundIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Penjualan", href: "/dashboard/sales", icon: CurrencyDollarIcon },
  { name: "Pembelian", href: "/dashboard/purchases", icon: TruckIcon },
  { name: "Produk", href: "/dashboard/products", icon: CubeIcon },
  { name: "Daftar Customers", href: "/dashboard/customers", icon: UsersIcon },
  {
    name: "Suppliers",
    href: "/dashboard/suppliers",
    icon: BuildingStorefrontIcon,
  },
  { name: "Laporan", href: "/dashboard/reports", icon: ChartBarIcon },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
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
  const [isManuallyToggled, setIsManuallyToggled] = useState(false); // Track if user explicitly toggled
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

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

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

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
    <>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        {/* --- Mobile Sidebar (No Changes Needed Here) --- */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
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
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <span className="text-white text-xl font-semibold">
                      Kasir Online
                    </span>
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {navigation.map((item) => {
                        const isCurrent =
                          item.href === "/dashboard"
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              isCurrent
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                            )}
                            onClick={() => setSidebarOpen(false)} // Close mobile sidebar on nav
                          >
                            <item.icon
                              className={classNames(
                                isCurrent
                                  ? "text-gray-300"
                                  : "text-gray-400 group-hover:text-gray-300",
                                "mr-4 h-6 w-6 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                  {/* --- START: Add user profile at bottom of MOBILE sidebar --- */}
                  {/* Optional: You could add a similar section here if desired for mobile */}
                  {/* --- END: Add user profile at bottom of MOBILE sidebar --- */}
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        {/* --- End Mobile Sidebar --- */}

        {/* --- Desktop Sidebar (Changes Here) --- */}
        <div
          className={classNames(
            "hidden md:fixed md:inset-y-0 md:flex md:flex-col transition-all duration-300",
            isCollapsed ? "md:w-16" : "md:w-64" // Width depends on state
          )}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
            {" "}
            {/* Changed from flex-grow to min-h-0 flex-1 */}
            {/* Top Section: Logo and Toggle */}
            <div className="flex h-16 flex-shrink-0 items-center justify-between bg-gray-900 px-4">
              {" "}
              {/* Added fixed height and bg */}
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
                  // -- FIX HERE --
                  isCollapsed ? "mx-auto" : "" // Use ternary operator
                  // -- END FIX --
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
              {" "}
              {/* Added overflow-y-auto here */}
              <TooltipProvider delayDuration={100}>
                <nav className="flex-1 space-y-1 px-2 py-4">
                  {" "}
                  {/* Adjusted padding */}
                  {navigation.map((item) => {
                    const isCurrent =
                      item.href === "/dashboard"
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return isCollapsed ? (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={classNames(
                              isCurrent
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "group flex items-center rounded-md px-2 py-2 text-sm font-medium justify-center"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                isCurrent
                                  ? "text-gray-300"
                                  : "text-gray-400 group-hover:text-gray-300",
                                "h-6 w-6 flex-shrink-0 mx-auto"
                              )}
                              aria-hidden="true"
                            />
                            <span className="sr-only">{item.name}</span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          isCurrent
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            isCurrent
                              ? "text-gray-300"
                              : "text-gray-400 group-hover:text-gray-300",
                            "h-6 w-6 flex-shrink-0 mr-3"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </TooltipProvider>
            </div>
            {/* --- START: User Profile Section at Bottom --- */}
            <div
              className={classNames(
                "flex-shrink-0 border-t border-gray-700 dark:border-gray-600 p-3 bg-gray-900 dark:bg-gray-800", // Added darker background for contrast
                isCollapsed ? "flex justify-center" : "flex items-center"
              )}
            >
              {/* User Menu Dropdown */}
              <Menu
                as="div"
                className="relative flex flex-row items-center w-full"
              >
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Menu.Button className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full">
                          <span className="sr-only">Open user menu</span>
                          {session?.user?.image ? (
                            <div className="inline-block h-9 w-9 overflow-hidden rounded-full bg-gray-600 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-500 ring-opacity-50">
                              <Image
                                src={session.user.image}
                                alt={session.user.name || "User profile"}
                                width={36}
                                height={36}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-600 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-500 ring-opacity-50">
                              <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                            </span>
                          )}
                        </Menu.Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={5}>
                        <p>User Menu</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Menu.Button className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full">
                      <span className="sr-only">Open user menu</span>
                      {session?.user?.image ? (
                        <div className="inline-block h-9 w-9 overflow-hidden rounded-full bg-gray-600 ring-2 ring-white ring-opacity-50">
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "User profile"}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-600 ring-2 ring-white ring-opacity-50">
                          <UserIcon className="h-6 w-6 text-gray-400" />
                        </span>
                      )}
                    </Menu.Button>
                  )}
                </div>

                {/* Name/Email (only when expanded) */}
                {!isCollapsed && (
                  <div className="min-w-0 flex-1 ml-3 flex flex-col justify-center">
                    <p className="text-sm font-medium text-white dark:text-gray-100 truncate leading-tight">
                      {session?.user?.name || session?.user?.email || "User"}
                    </p>
                    {/* Optionally show email if different from name */}
                    {session?.user?.email &&
                      session.user.name &&
                      session.user.email !== session.user.name && (
                        <p className="text-xs font-medium text-gray-400 dark:text-gray-300 truncate mt-0.5 leading-tight">
                          {session?.user?.email}
                        </p>
                      )}
                  </div>
                )}

                {/* Dropup Menu */}
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute bottom-full left-0 mb-2 w-56 origin-bottom-left rounded-lg bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
                    {/* User info section */}
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {session?.user?.name || session?.user?.email || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {session?.user?.email || ""}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/profile"
                            className={classNames(
                              active ? "bg-gray-50 dark:bg-gray-700" : "",
                              "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            )}
                          >
                            <UserIcon
                              className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                              aria-hidden="true"
                            />
                            Lihat Profil
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/settings"
                            className={classNames(
                              active ? "bg-gray-50 dark:bg-gray-700" : "",
                              "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            )}
                          >
                            <Cog6ToothIcon
                              className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                              aria-hidden="true"
                            />
                            Pengaturan Akun
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/billing"
                            className={classNames(
                              active ? "bg-gray-50 dark:bg-gray-700" : "",
                              "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            )}
                          >
                            <ReceiptRefundIcon
                              className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                              aria-hidden="true"
                            />
                            Billing
                          </Link>
                        )}
                      </Menu.Item>
                    </div>

                    {/* Logout section */}
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            disabled={isPending}
                            className={classNames(
                              active ? "bg-gray-50 dark:bg-gray-700" : "",
                              "flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                            )}
                          >
                            <ArrowRightOnRectangleIcon
                              className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                              aria-hidden="true"
                            />
                            {isPending ? "Logging out..." : "Logout"}
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            {/* --- END: User Profile Section at Bottom --- */}
          </div>
        </div>
        {/* --- End Desktop Sidebar --- */}

        {/* --- Main Content (Changes Here) --- */}
        <div
          className={classNames(
            "flex flex-1 flex-col transition-all duration-300 h-screen",
            isCollapsed ? "md:pl-16" : "md:pl-64" // Adjust left padding
          )}
        >
          {/* --- Header / Top Bar (No changes needed here) --- */}
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
              {/* --- User Menu and Theme Toggle --- */}
              <div className="ml-4 flex items-center md:ml-6">
                {/* Theme Toggle Button */}
                <div className="mr-3">
                  <ThemeToggle />
                </div>

                {/* User Menu */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white dark:bg-gray-700 border-2 border-indigo-100 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 p-0.5 shadow-sm hover:shadow transition-all duration-200">
                      <span className="sr-only">Buka menu pengguna</span>
                      {session?.user?.image ? (
                        <div className="inline-block h-9 w-9 overflow-hidden rounded-full bg-gray-100">
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "User profile"}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        // Using UserIcon for consistency with bottom profile placeholder
                        <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-50">
                          <UserIcon className="h-6 w-6 text-indigo-300" />
                        </span>
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
                      {/* User info section */}
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {session?.user?.name ||
                            session?.user?.email ||
                            "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {session?.user?.email || ""}
                        </p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/dashboard/profile"
                              className={classNames(
                                active ? "bg-gray-50 dark:bg-gray-700" : "",
                                "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                              )}
                            >
                              <UserIcon
                                className="mr-3 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              Profil
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/dashboard/billing"
                              className={classNames(
                                active ? "bg-gray-50 dark:bg-gray-700" : "",
                                "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                              )}
                            >
                              <ReceiptRefundIcon
                                className="mr-3 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              Tagihan
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/dashboard/settings"
                              className={classNames(
                                active ? "bg-gray-50 dark:bg-gray-700" : "",
                                "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                              )}
                            >
                              <Cog6ToothIcon
                                className="mr-3 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              Pengaturan
                            </Link>
                          )}
                        </Menu.Item>
                      </div>

                      {/* Logout section */}
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              disabled={isPending}
                              className={classNames(
                                active ? "bg-gray-50 dark:bg-gray-700" : "",
                                "flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                              )}
                            >
                              <ArrowRightOnRectangleIcon
                                className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                                aria-hidden="true"
                              />
                              {isPending ? "Logging out..." : "Keluar"}
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              {/* --- End User Menu --- */}
            </div>
          </div>
          {/* --- End Header / Top Bar --- */}

          {/* --- Page Content --- */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {/* Page content goes here */}
                {children}
              </div>
            </div>
          </main>
          {/* --- End Page Content --- */}
        </div>
        {/* --- End Main Content --- */}
      </div>
    </>
  );
};

export default DashboardLayout;
