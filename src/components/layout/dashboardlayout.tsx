"use client";
import React, { useState, Fragment, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Transition, Dialog, Menu } from "@headlessui/react";
import { logout } from "@/actions/logout";
import { useTransition } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  TruckIcon,
  CubeIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Penjualan", href: "/dashboard/sales", icon: CurrencyDollarIcon },
  { name: "Pembelian", href: "/dashboard/purchases", icon: TruckIcon },
  { name: "Produk", href: "/dashboard/products", icon: CubeIcon },
  { name: "Laporan", href: "/dashboard/reports", icon: ChartBarIcon },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  pageTitle = "Dashboard",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <>
      <div className="min-h-screen flex bg-gray-100">
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
                  <div className="absolute right-0 top-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {/* <span className="sr-only">Tutup sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      /> */}
                    </button>
                  </div>
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
                            onClick={() => setSidebarOpen(false)}
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
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true" />
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto bg-gray-800 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-white text-xl font-semibold">
                Kasir Online
              </span>
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
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
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          isCurrent
                            ? "text-gray-300"
                            : "text-gray-400 group-hover:text-gray-300",
                          "mr-3 h-6 w-6 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Buka sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1 items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  {pageTitle}
                </h1>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-1">
                      <span className="sr-only">Buka menu pengguna</span>
                      <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
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
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Profil
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            disabled={isPending}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
                            )}
                          >
                            {isPending ? "Logging out..." : "Keluar"}
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
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
