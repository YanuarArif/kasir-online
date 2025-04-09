"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/update-profile";
import { updatePassword } from "@/actions/update-password";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  UserCircleIcon,
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  image: string | null;
}

interface AccountSettingsProps {
  user: User;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const router = useRouter();
  const { update } = useSession();

  // Profile form state
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password form state
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Form values
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [imageUrl, setImageUrl] = useState(user.image || "");

  // Password form values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="space-y-10">
      {/* Profile Settings Section */}
      <div>
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
          <UserCircleIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Profil Pengguna
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Kelola informasi pribadi dan preferensi akun Anda
            </p>
          </div>
        </div>

        <form
          className="p-6 space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsProfileLoading(true);
            setProfileSuccess(null);
            setProfileError(null);

            try {
              const result = await updateProfile({
                name,
                username,
                image: imageUrl,
              });

              if (result.error) {
                setProfileError(result.error);
              } else {
                setProfileSuccess("Profil berhasil diperbarui!");
                await update({ ...user, name, username, image: imageUrl });
                router.refresh();
              }
            } catch (err) {
              setProfileError("Terjadi kesalahan saat memperbarui profil.");
              console.error(err);
            } finally {
              setIsProfileLoading(false);
            }
          }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Masukkan username"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={user.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors duration-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Email tidak dapat diubah
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                URL Foto Profil
              </label>
              <input
                type="url"
                name="image"
                id="image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Masukkan URL gambar untuk foto profil Anda
              </p>
            </div>

            {imageUrl && (
              <div className="sm:col-span-2 flex justify-center">
                <div className="mt-4 h-32 w-32 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 ring-2 ring-indigo-100 dark:ring-indigo-800 transition-all duration-300 hover:ring-indigo-300 dark:hover:ring-indigo-600">
                  <Image
                    src={imageUrl}
                    alt="Preview foto profil"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                    onError={() =>
                      setImageUrl("https://via.placeholder.com/150?text=Error")
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {profileSuccess && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 animate-fade-in">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-300">
                  {profileSuccess}
                </p>
              </div>
            </div>
          )}

          {profileError && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 animate-fade-in">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
                <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-300">
                  {profileError}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setName(user.name || "");
                setUsername(user.username || "");
                setImageUrl(user.image || "");
                setProfileSuccess(null);
                setProfileError(null);
              }}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-sm"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isProfileLoading}
              className={`px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 ${
                isProfileLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-md"
              }`}
            >
              {isProfileLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Section */}
      <div>
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
          <KeyIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Ubah Password
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Perbarui password akun Anda
            </p>
          </div>
        </div>

        <form
          className="p-6 space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsPasswordLoading(true);
            setPasswordSuccess(null);
            setPasswordError(null);

            try {
              const result = await updatePassword({
                currentPassword,
                newPassword,
                confirmPassword,
              });

              if (result.error) {
                setPasswordError(result.error);
              } else {
                setPasswordSuccess("Password berhasil diperbarui!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }
            } catch (err) {
              setPasswordError("Terjadi kesalahan saat memperbarui password.");
              console.error(err);
            } finally {
              setIsPasswordLoading(false);
            }
          }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password Saat Ini
              </label>
              <input
                type="password"
                name="current-password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Masukkan password saat ini"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password Baru
              </label>
              <input
                type="password"
                name="new-password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Masukkan password baru"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                placeholder="Konfirmasi password baru"
                required
              />
            </div>
          </div>

          {passwordSuccess && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 animate-fade-in">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-300">
                  {passwordSuccess}
                </p>
              </div>
            </div>
          )}

          {passwordError && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 animate-fade-in">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
                <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-300">
                  {passwordError}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordSuccess(null);
                setPasswordError(null);
              }}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-sm"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isPasswordLoading}
              className={`px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 ${
                isPasswordLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-md"
              }`}
            >
              {isPasswordLoading ? "Memperbarui..." : "Perbarui Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Custom Animation Styles */}
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
