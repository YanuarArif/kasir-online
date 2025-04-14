"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ClockIcon,
  CalendarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface User {
  id: string;
  lastLogin: Date | null;
  createdAt: Date;
}

interface AccountActivitySectionProps {
  user: User;
}

export default function AccountActivitySection({ user }: AccountActivitySectionProps) {
  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <ClockIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Aktivitas Akun
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Informasi tentang aktivitas login dan penggunaan akun Anda
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <CalendarIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Tanggal Pendaftaran
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {user.createdAt ? (
                format(new Date(user.createdAt), "d MMMM yyyy, HH:mm", { locale: id })
              ) : (
                "Tidak tersedia"
              )}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <ClockIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Login Terakhir
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {user.lastLogin ? (
                format(new Date(user.lastLogin), "d MMMM yyyy, HH:mm", { locale: id })
              ) : (
                "Tidak tersedia"
              )}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Informasi Keamanan
              </p>
              <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                Kami menyimpan informasi login untuk membantu melindungi akun Anda. 
                Jika Anda melihat aktivitas login yang mencurigakan, segera ubah password Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
