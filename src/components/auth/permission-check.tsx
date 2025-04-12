"use client";

import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PermissionCheckProps {
  children: React.ReactNode;
  requiredRoles: Role[];
  fallback?: React.ReactNode;
}

/**
 * A client component that conditionally renders children based on user role
 * @param children Content to render if user has permission
 * @param requiredRoles Array of roles that are allowed to see the content
 * @param fallback Optional content to render if user doesn't have permission
 */
export function PermissionCheck({
  children,
  requiredRoles,
  fallback = null,
}: PermissionCheckProps) {
  const { data: session, status } = useSession();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const userRole = session.user.role as Role;
      setHasPermission(requiredRoles.includes(userRole));
    } else {
      setHasPermission(false);
    }
  }, [session, status, requiredRoles]);

  // While loading, don't render anything
  if (status === "loading") {
    return null;
  }

  // If user has permission, render children, otherwise render fallback
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * A hook that returns whether the current user has one of the specified roles
 * @param requiredRoles Array of roles to check against
 * @returns Boolean indicating if user has one of the required roles
 */
export function useHasRole(requiredRoles: Role[]): boolean {
  const { data: session, status } = useSession();
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const userRole = session.user.role as Role;
      setHasRole(requiredRoles.includes(userRole));
    } else {
      setHasRole(false);
    }
  }, [session, status, requiredRoles]);

  return hasRole;
}

/**
 * A hook that returns whether the current user can access a specific path
 * @param path The path to check permissions for
 * @returns Boolean indicating if user has permission for the path
 */
export function useCanAccessPath(path: string): boolean {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      if (session?.user?.role) {
        try {
          // We need to make a server request to check permissions
          // since our permission logic is on the server
          const response = await fetch(
            `/api/permissions/check?path=${encodeURIComponent(path)}`
          );
          const data = await response.json();
          setCanAccess(data.hasPermission);
        } catch (error) {
          console.error("Error checking permission:", error);
          setCanAccess(false);
        }
      } else {
        setCanAccess(false);
      }
    };

    checkPermission();
  }, [session, path, pathname]);

  return canAccess;
}
