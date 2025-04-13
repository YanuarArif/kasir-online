import { redirect } from "next/navigation";

// Redirect to the summaries page
export default function DashboardPage() {
  redirect("/dashboard/summaries");
}
