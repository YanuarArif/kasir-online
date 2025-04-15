import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserPaymentHistory } from "@/lib/subscription";

// GET /api/payments - Get user's payment history
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await getUserPaymentHistory(session.user.id);

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error getting payments:", error);
    return NextResponse.json(
      { error: "Failed to get payments" },
      { status: 500 }
    );
  }
}
