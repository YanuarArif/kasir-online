import { Role } from "@prisma/client";

// Define the role hierarchy (higher roles have more permissions)
export const roleHierarchy: Record<Role, number> = {
  OWNER: 3,
  ADMIN: 2,
  CASHIER: 1,
};

// Define page access permissions for each role
export const pagePermissions: Record<string, Role[]> = {
  // Dashboard pages
  "/dashboard": [Role.OWNER, Role.ADMIN, Role.CASHIER], // All roles can access dashboard

  // Product management
  "/dashboard/products": [Role.OWNER, Role.ADMIN, Role.CASHIER],
  "/dashboard/products/new": [Role.OWNER, Role.ADMIN],
  "/dashboard/products/edit": [Role.OWNER, Role.ADMIN],

  // Sales management
  "/dashboard/sales": [Role.OWNER, Role.ADMIN, Role.CASHIER],
  "/dashboard/sales/new": [Role.OWNER, Role.ADMIN, Role.CASHIER],

  // Purchase management
  "/dashboard/purchases": [Role.OWNER, Role.ADMIN],
  "/dashboard/purchases/new": [Role.OWNER, Role.ADMIN],

  // Supplier management
  "/dashboard/suppliers": [Role.OWNER, Role.ADMIN],
  "/dashboard/suppliers/new": [Role.OWNER, Role.ADMIN],

  // Customer management
  "/dashboard/customers": [Role.OWNER, Role.ADMIN, Role.CASHIER],
  "/dashboard/customers/new": [Role.OWNER, Role.ADMIN, Role.CASHIER],

  // Settings
  "/dashboard/settings": [Role.OWNER, Role.ADMIN, Role.CASHIER],
  "/dashboard/settings/account": [Role.OWNER, Role.ADMIN, Role.CASHIER],
  "/dashboard/settings/business": [Role.OWNER, Role.ADMIN],
  "/dashboard/settings/security": [Role.OWNER, Role.ADMIN, Role.CASHIER],
  "/dashboard/settings/notifications": [Role.OWNER, Role.ADMIN, Role.CASHIER],
  "/dashboard/settings/employees": [Role.OWNER],
  "/dashboard/settings/users": [Role.OWNER, Role.ADMIN],

  // Billing
  "/dashboard/billing": [Role.OWNER],

  // Role-specific pages
  "/dashboard/cashier": [Role.OWNER, Role.ADMIN, Role.CASHIER],
  "/dashboard/admin-only": [Role.OWNER, Role.ADMIN],
  "/dashboard/owner-only": [Role.OWNER],
  "/dashboard/rbac-demo": [Role.OWNER, Role.ADMIN, Role.CASHIER],

  // Reports
  "/dashboard/reports": [Role.OWNER, Role.ADMIN],
};

/**
 * Check if a user with the given role has permission to access a specific page
 * @param userRole The role of the user
 * @param path The path to check permissions for
 * @returns boolean indicating if the user has permission
 */
export function hasPermission(userRole: Role, path: string): boolean {
  // Find the most specific matching path
  const matchingPaths = Object.keys(pagePermissions)
    .filter((permPath) => path.startsWith(permPath))
    .sort((a, b) => b.length - a.length); // Sort by specificity (longest path first)

  if (matchingPaths.length === 0) {
    return false; // No matching path found
  }

  const mostSpecificPath = matchingPaths[0];
  const allowedRoles = pagePermissions[mostSpecificPath];

  return allowedRoles.includes(userRole);
}

/**
 * Check if a user with the given role has a higher or equal role level compared to the required role
 * @param userRole The role of the user
 * @param requiredRole The minimum required role
 * @returns boolean indicating if the user has sufficient role level
 */
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
