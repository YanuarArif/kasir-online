import { Role } from "@prisma/client";
import { hasPermission } from "@/lib/rbac";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get("path");

    // If no path provided or user not authenticated, return false
    if (!path || !session?.user?.role) {
      return NextResponse.json({ hasPermission: false });
    }

    const userRole = session.user.role as Role;
    const permitted = hasPermission(userRole, path);

    return NextResponse.json({ hasPermission: permitted });
  } catch (error) {
    console.error("Error checking permission:", error);
    return NextResponse.json(
      { hasPermission: false, error: "Failed to check permission" },
      { status: 500 }
    );
  }
}
