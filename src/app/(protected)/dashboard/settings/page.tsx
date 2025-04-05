import SettingsPage from "@/app/pages/dashboard/settings/settings";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

const Settings = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user data from database
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <SettingsPage user={user} />;
};

export default Settings;
