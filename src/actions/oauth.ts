"use server";

import { signIn } from "@/lib/auth";

export const signInWithGoogle = async () => {
  try {
    // Attempt to sign in with Google
    // Note: OAuth providers will always redirect, so we don't use redirect: false here
    await signIn("google");
    return { success: true };
  } catch (error: any) {
    // Google sign-in will always redirect, so this is expected
    if (error?.message?.includes("NEXT_REDIRECT")) {
      return { success: true };
    }
    console.error("Error signing in with Google:", error);
    return { error: "Terjadi kesalahan saat login dengan Google!" };
  }
};
