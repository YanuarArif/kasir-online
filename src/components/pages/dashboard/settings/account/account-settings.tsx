"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Import the new components
import ProfileSettingsForm from "./ProfileSettingsForm";
import PasswordSettingsForm from "./PasswordSettingsForm";
import AccountActivitySection from "./AccountActivitySection";
import TwoFactorAuthSection from "./TwoFactorAuthSection";
import DeleteAccountSection from "./DeleteAccountSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import icons
import {
  UserCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

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

  // Animation variants for content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="profile"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="bg-white dark:bg-gray-800  border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Pengaturan Akun
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Kelola informasi pribadi, keamanan, dan aktivitas akun Anda
            </p>
          </div>
          <div className="relative">
            <TabsList className="w-full flex justify-between bg-gray-50 dark:bg-gray-800 p-1 rounded-none border-b border-gray-200 dark:border-gray-700">
              {/* Animated tab indicator */}
              <motion.div
                className="absolute bottom-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                animate={{
                  left:
                    activeTab === "profile"
                      ? "calc(16.67%)"
                      : activeTab === "security"
                        ? "calc(50%)"
                        : "calc(83.33%)",
                  translateX: "-50%",
                  width:
                    activeTab === "profile"
                      ? "5rem"
                      : activeTab === "security"
                        ? "6rem"
                        : "5.5rem",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <TabsTrigger
                value="profile"
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium text-sm transition-all ${activeTab === "profile" ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-750 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>Profil</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium text-sm transition-all ${activeTab === "security" ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-750 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
              >
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Keamanan</span>
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">
                  2FA
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium text-sm transition-all ${activeTab === "activity" ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-750 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
              >
                <ClockIcon className="h-5 w-5" />
                <span>Aktivitas</span>
                {user.lastLogin && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
                    Baru
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 relative z-10 bg-white dark:bg-gray-800 shadow-sm">
            <TabsContent value="profile" className="space-y-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <ProfileSettingsForm user={user} />
              </motion.div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <div className="space-y-6">
                  <PasswordSettingsForm />
                  <TwoFactorAuthSection />
                  <DeleteAccountSection />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <AccountActivitySection user={user} />
              </motion.div>
            </TabsContent>
          </div>
        </div>
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
