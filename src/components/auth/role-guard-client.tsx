"use client";

import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { RoleAccessMessage } from "../ui/role-access-message";

interface RoleGuardClientProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

/**
 * A client component that conditionally renders content based on user role
 * @param children The content to render if the user has the required role
 * @param allowedRoles Array of roles that are allowed to see the content
 * @param fallback Optional content to render if the user doesn't have the required role
 * @param showMessage Whether to show an access denied message if the user doesn't have the required role
 */
export function RoleGuardClient({
  children,
  allowedRoles,
  fallback,
  showMessage = true,
}: RoleGuardClientProps) {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role as Role | undefined;
  
  // If still loading, show nothing
  if (status === "loading") {
    return null;
  }
  
  // If not authenticated, show nothing
  if (!session?.user) {
    return null;
  }
  
  // If user has one of the allowed roles, show the children
  if (userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  // If user doesn't have the required role, show the fallback or message
  return (
    <>
      {showMessage && userRole && (
        <RoleAccessMessage
          userRole={userRole}
          requiredRoles={allowedRoles}
          className="mb-4"
        />
      )}
      {fallback}
    </>
  );
}
