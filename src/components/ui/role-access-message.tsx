"use client";

import React from "react";
import { Role } from "@prisma/client";
import { ShieldCheckIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RoleAccessMessageProps {
  userRole: Role;
  requiredRoles: Role[];
  title?: string;
  description?: string;
  className?: string;
}

export function RoleAccessMessage({
  userRole,
  requiredRoles,
  title = "Akses Terbatas",
  description,
  className,
}: RoleAccessMessageProps) {
  // Check if user has access
  const hasAccess = requiredRoles.includes(userRole);
  
  // Get default description based on access
  const getDefaultDescription = () => {
    if (hasAccess) {
      return "Anda memiliki akses ke halaman ini.";
    }
    
    const roleNames = requiredRoles.map(role => {
      switch (role) {
        case Role.OWNER: return "Pemilik";
        case Role.ADMIN: return "Admin";
        case Role.CASHIER: return "Kasir";
        default: return role;
      }
    }).join(" atau ");
    
    return `Halaman ini hanya dapat diakses oleh ${roleNames}.`;
  };
  
  // If user has access, don't show the message
  if (hasAccess) {
    return null;
  }
  
  return (
    <Alert 
      variant="destructive"
      className={cn("border-red-500 dark:border-red-400", className)}
    >
      <LockClosedIcon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        <ShieldCheckIcon className="h-4 w-4" />
        {title}
      </AlertTitle>
      <AlertDescription>
        {description || getDefaultDescription()}
      </AlertDescription>
    </Alert>
  );
}
