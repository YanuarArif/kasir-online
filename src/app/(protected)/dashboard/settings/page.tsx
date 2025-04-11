"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Client-side redirect to account settings page
export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/settings/account");
  }, [router]);

  // Return a loading state or empty div while redirecting
  return (
    <div className="flex items-center justify-center h-full">Loading...</div>
  );
}
