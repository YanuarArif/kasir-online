"use client";

import React from "react";
import { Role } from "@prisma/client";
import { ShieldCheckIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: Role;
  isEmployee?: boolean;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function RoleBadge({
  role,
  isEmployee = false,
  size = "md",
  showIcon = true,
  className,
}: RoleBadgeProps) {
  // Get role display name
  const getRoleDisplayName = (role: Role) => {
    switch (role) {
      case Role.OWNER:
        return "Pemilik";
      case Role.ADMIN:
        return "Admin";
      case Role.CASHIER:
        return "Kasir";
      default:
        return "Unknown";
    }
  };

  // Get role color
  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.OWNER:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case Role.ADMIN:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case Role.CASHIER:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Get size classes
  const getSizeClasses = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "text-xs px-1.5 py-0.5 rounded";
      case "md":
        return "text-xs px-2 py-1 rounded-md";
      case "lg":
        return "text-sm px-2.5 py-1.5 rounded-md";
      default:
        return "text-xs px-2 py-1 rounded-md";
    }
  };

  // Get icon size
  const getIconSize = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "h-3 w-3";
      case "md":
        return "h-3.5 w-3.5";
      case "lg":
        return "h-4 w-4";
      default:
        return "h-3.5 w-3.5";
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span
        className={cn(
          "inline-flex items-center font-medium",
          getRoleColor(role),
          getSizeClasses(size),
          className
        )}
      >
        {showIcon && (
          <ShieldCheckIcon className={cn(getIconSize(size), "mr-1")} />
        )}
        <span>{getRoleDisplayName(role)}</span>
      </span>

      {isEmployee && (
        <span
          className={cn(
            "inline-flex items-center font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
            getSizeClasses(size)
          )}
        >
          {showIcon && (
            <UserGroupIcon className={cn(getIconSize(size), "mr-1")} />
          )}
          <span>Karyawan</span>
        </span>
      )}
    </div>
  );
}
