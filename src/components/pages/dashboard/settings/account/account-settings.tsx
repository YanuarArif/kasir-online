"use client";

import { useState } from "react";

// Import the new components
import ProfileSettingsForm from "./ProfileSettingsForm";
import PasswordSettingsForm from "./PasswordSettingsForm";
import AccountActivitySection from "./AccountActivitySection";
import TwoFactorAuthSection from "./TwoFactorAuthSection";
import DeleteAccountSection from "./DeleteAccountSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Keep User interface definition
interface User {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  image: string | null;
  phone: string | null;
  bio: string | null;
  lastLogin: Date | null;
  createdAt: Date; // Keep if needed elsewhere, otherwise remove
}

interface AccountSettingsProps {
  user: User;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="profile"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-2">
          <TabsList className="bg-transparent p-0 space-x-6">
            <TabsTrigger
              value="profile"
              className={`pb-2 px-1 font-medium border-b-2 rounded-none ${activeTab === "profile" ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent"}`}
            >
              Profil
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className={`pb-2 px-1 font-medium border-b-2 rounded-none ${activeTab === "security" ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent"}`}
            >
              Keamanan
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className={`pb-2 px-1 font-medium border-b-2 rounded-none ${activeTab === "activity" ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent"}`}
            >
              Aktivitas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <ProfileSettingsForm user={user} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <PasswordSettingsForm />
          <TwoFactorAuthSection />
          <DeleteAccountSection />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-6">
          <AccountActivitySection user={user} />
        </TabsContent>
      </Tabs>

      {/* Keep Custom Animation Styles if needed globally here */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
