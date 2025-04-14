"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Role } from "@prisma/client";
import { PermissionCheck } from "@/components/auth/permission-check";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

interface SettingsNavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description: string;
  roles?: Role[];
}

const settingsNavItems: SettingsNavItem[] = [
  {
    title: "Akun",
    href: "/dashboard/settings/account",
    icon: UserCircleIcon,
    description: "Kelola informasi pribadi dan preferensi akun Anda",
  },
  {
    title: "Tampilan",
    href: "/dashboard/settings/appearance",
    icon: PaintBrushIcon,
    description: "Sesuaikan tampilan aplikasi sesuai preferensi Anda",
  },
  {
    title: "Keamanan",
    href: "/dashboard/settings/security",
    icon: ShieldCheckIcon,
    description: "Kelola pengaturan keamanan dan autentikasi akun Anda",
  },
  {
    title: "Notifikasi",
    href: "/dashboard/settings/notifications",
    icon: BellIcon,
    description: "Atur preferensi notifikasi dan pemberitahuan",
  },
  {
    title: "Bisnis",
    href: "/dashboard/settings/business",
    icon: BuildingStorefrontIcon,
    description: "Kelola informasi bisnis dan pengaturan toko Anda",
  },
  {
    title: "Tagihan",
    href: "/dashboard/settings/billing",
    icon: CreditCardIcon,
    description: "Kelola langganan dan metode pembayaran Anda",
  },

  {
    title: "Karyawan",
    href: "/dashboard/settings/employees",
    icon: UserGroupIcon,
    description: "Kelola karyawan dan akses mereka ke sistem",
    roles: [Role.OWNER],
  },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");

  // Set active tab based on current pathname
  useEffect(() => {
    // Find the matching nav item
    const matchingItem = settingsNavItems.find((item) =>
      pathname.includes(item.href)
    );

    if (matchingItem) {
      setActiveTab(matchingItem.href);
    } else if (pathname === "/dashboard/settings") {
      // If we're at the base settings path, set the active tab to account
      setActiveTab("/dashboard/settings/account");
    }
  }, [pathname, router]);

  return (
    // Removed max-w-7xl and mx-auto for full width, kept padding for margins
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8 px-4 sm:px-6 lg:px-8 py-8">
      {/* Settings Sidebar */}
      {/* Adjusted width for medium screens */}
      <aside className="w-full md:w-1/3 lg:w-1/4">
        <div className="sticky top-8 space-y-6">
          {/* Refined card styling: softer shadow, simpler background */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Simplified header */}
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Cog6ToothIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Pengaturan
                </h2>
              </div>
            </div>
            <nav className="p-3 space-y-1">
              {" "}
              {/* Reduced padding */}
              {settingsNavItems.map((item) => {
                // If the item has roles restriction, wrap it in PermissionCheck
                if (item.roles) {
                  return (
                    <PermissionCheck key={item.href} requiredRoles={item.roles}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors duration-150 text-sm", // Adjusted padding, text size
                          activeTab === item.href
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium" // Enhanced active state
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-gray-100" // Subtle hover
                        )}
                        onClick={() => setActiveTab(item.href)}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 mt-0.5 flex-shrink-0", // Added margin-top for alignment
                            activeTab === item.href
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" // Icon hover color
                          )}
                        />
                        <div className="flex-grow">
                          {" "}
                          {/* Allow text to wrap */}
                          <div className="font-medium">{item.title}</div>
                          {/* Show description on medium screens and up */}
                          <p className="text-xs text-gray-500 dark:text-gray-400/80 mt-0.5 hidden md:block">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </PermissionCheck>
                  );
                }

                // Regular item without role restriction
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors duration-150 text-sm", // Adjusted padding, text size
                      activeTab === item.href
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium" // Enhanced active state
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-gray-100" // Subtle hover
                    )}
                    onClick={() => setActiveTab(item.href)}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 mt-0.5 flex-shrink-0", // Added margin-top for alignment
                        activeTab === item.href
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" // Icon hover color
                      )}
                    />
                    <div className="flex-grow">
                      {" "}
                      {/* Allow text to wrap */}
                      <div className="font-medium">{item.title}</div>
                      {/* Show description on medium screens and up */}
                      <p className="text-xs text-gray-500 dark:text-gray-400/80 mt-0.5 hidden md:block">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Refined card styling to match sidebar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
