"use server";

import { auth } from "@/lib/auth";

/**
 * Gets the effective user ID for data access.
 * If the current user is an employee, returns their owner's ID.
 * Otherwise, returns the user's own ID.
 *
 * @returns The effective user ID for data access or null if not authenticated
 */
export async function getEffectiveUserId(): Promise<string | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // If the user is an employee, use their owner's ID
  // Need to use type assertion since TypeScript doesn't know about these custom properties
  const user = session.user as any;
  if (user.isEmployee && user.ownerId) {
    return user.ownerId;
  }

  // Otherwise, use the user's own ID (or null if id is undefined)
  return session.user.id || null;
}
