import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import { hasPermission } from "@/lib/rbac";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

/**
 * A server component that protects routes based on user authentication and role
 * @param children The content to render if the user is authenticated and has the required role
 * @param allowedRoles Optional array of roles that are allowed to access the route
 * @param redirectTo Optional path to redirect to if the user is not authenticated or doesn't have the required role
 */
export async function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
}: ProtectedRouteProps) {
  const session = await auth();
  
  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect("/login");
  }
  
  // If no specific roles are required, just check authentication
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }
  
  const userRole = session.user.role as Role;
  
  // Check if user has one of the allowed roles
  if (!allowedRoles.includes(userRole)) {
    redirect(redirectTo);
  }
  
  // User has permission, render children
  return <>{children}</>;
}

/**
 * A server component that protects routes based on path permissions
 * @param children The content to render if the user has permission to access the path
 * @param path The path to check permissions for
 * @param redirectTo Optional path to redirect to if the user doesn't have permission
 */
export async function PathProtectedRoute({
  children,
  path,
  redirectTo = "/dashboard",
}: {
  children: React.ReactNode;
  path: string;
  redirectTo?: string;
}) {
  const session = await auth();
  
  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect("/login");
  }
  
  const userRole = session.user.role as Role;
  
  // Check if user has permission to access the path
  if (!hasPermission(userRole, path)) {
    redirect(redirectTo);
  }
  
  // User has permission, render children
  return <>{children}</>;
}
