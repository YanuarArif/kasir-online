import { Role } from "@prisma/client";
import { hasPermission } from "@/lib/rbac";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackPath?: string;
}

/**
 * A server component that checks if the current user has one of the allowed roles
 * If not, redirects to the fallback path (defaults to /dashboard)
 */
export async function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = "/dashboard",
}: RoleGuardProps) {
  const session = await auth();

  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect("/login");
  }

  const userRole = session.user.role as Role;

  // If user doesn't have one of the allowed roles, redirect to fallback path
  if (!allowedRoles.includes(userRole)) {
    redirect(fallbackPath);
  }

  // User has permission, render children
  return <>{children}</>;
}

/**
 * A higher-order component that wraps a page component with role-based access control
 * @param Component The page component to wrap
 * @param allowedRoles Array of roles that are allowed to access the page
 * @param fallbackPath Path to redirect to if user doesn't have permission (defaults to /dashboard)
 */
export function withRoleGuard(
  Component: React.ComponentType<any>,
  allowedRoles: Role[],
  fallbackPath = "/dashboard"
) {
  return async function ProtectedPage(props: any) {
    const session = await auth();

    // If not authenticated, redirect to login
    if (!session?.user) {
      redirect("/login");
    }

    const userRole = session.user.role as Role;

    // If user doesn't have one of the allowed roles, redirect to fallback path
    if (!allowedRoles.includes(userRole)) {
      redirect(fallbackPath);
    }

    // User has permission, render the component
    return <Component {...props} />;
  };
}

/**
 * A utility function to check if the current path is accessible by the user's role
 * For use in client components (e.g., navigation)
 */
export function checkPathPermission(path: string, userRole: Role): boolean {
  return hasPermission(userRole, path);
}
