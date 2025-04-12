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
  UsersIcon,
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
    title: "Pengguna",
    href: "/dashboard/settings/users",
    icon: UsersIcon,
    description: "Kelola pengguna dan peran akses",
    roles: [Role.OWNER, Role.ADMIN],
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
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Settings Sidebar */}
      <aside className="lg:w-1/4">
        <div className="sticky top-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
              <div className="flex items-center gap-3">
                <Cog6ToothIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Pengaturan
                </h2>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kelola preferensi dan pengaturan akun Anda
              </p>
            </div>
            <nav className="p-4 space-y-1">
              {settingsNavItems.map((item) => {
                // If the item has roles restriction, wrap it in PermissionCheck
                if (item.roles) {
                  return (
                    <PermissionCheck key={item.href} requiredRoles={item.roles}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                          activeTab === item.href
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        )}
                        onClick={() => setActiveTab(item.href)}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5",
                            activeTab === item.href
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden lg:block">
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
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      activeTab === item.href
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    )}
                    onClick={() => setActiveTab(item.href)}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        activeTab === item.href
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden lg:block">
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
