import { redirect } from "next/navigation";

// Redirect to account settings page
export default function SettingsPage() {
  redirect("/dashboard/settings/account");
}
