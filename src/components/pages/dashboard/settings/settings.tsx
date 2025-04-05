"use client";
import type { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboardlayout";
import {
  UserCircleIcon,
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { updateProfile } from "@/actions/update-profile";
import { updatePassword } from "@/actions/update-password";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  image: string | null;
}

interface SettingsPageProps {
  user: User;
}

const SettingsPage: NextPage<SettingsPageProps> = ({ user }) => {
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
    <DashboardLayout pageTitle="Pengaturan">
      <Head>
        <title>Pengaturan - Kasir Online</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Profile Settings Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white">
            <UserCircleIcon className="h-7 w-7 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Profil Pengguna
              </h2>
              <p className="mt-1 text-sm text-gray-600">
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
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Masukkan username"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Alamat Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Email tidak dapat diubah
                </p>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL Foto Profil
                </label>
                <input
                  type="url"
                  name="image"
                  id="image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Masukkan URL gambar untuk foto profil Anda
                </p>
              </div>

              {imageUrl && (
                <div className="sm:col-span-2 flex justify-center">
                  <div className="mt-4 h-32 w-32 overflow-hidden rounded-full bg-gray-100 ring-2 ring-indigo-100 transition-all duration-300 hover:ring-indigo-300">
                    <Image
                      src={imageUrl}
                      alt="Preview foto profil"
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                      onError={() =>
                        setImageUrl(
                          "https://via.placeholder.com/150?text=Error"
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {profileSuccess && (
              <div className="rounded-lg bg-green-50 p-4 animate-fade-in">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <p className="ml-3 text-sm font-medium text-green-800">
                    {profileSuccess}
                  </p>
                </div>
              </div>
            )}

            {profileError && (
              <div className="rounded-lg bg-red-50 p-4 animate-fade-in">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="ml-3 text-sm font-medium text-red-800">
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
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isProfileLoading}
                className={`px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 ${
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white">
            <KeyIcon className="h-7 w-7 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ubah Password</h2>
              <p className="mt-1 text-sm text-gray-600">
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
                setPasswordError(
                  "Terjadi kesalahan saat memperbarui password."
                );
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
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  name="current-password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Masukkan password saat ini"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Baru
                </label>
                <input
                  type="password"
                  name="new-password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Masukkan password baru"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-500">Minimal 6 karakter</p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Konfirmasi password baru"
                  required
                />
              </div>
            </div>

            {passwordSuccess && (
              <div className="rounded-lg bg-green-50 p-4 animate-fade-in">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <p className="ml-3 text-sm font-medium text-green-800">
                    {passwordSuccess}
                  </p>
                </div>
              </div>
            )}

            {passwordError && (
              <div className="rounded-lg bg-red-50 p-4 animate-fade-in">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="ml-3 text-sm font-medium text-red-800">
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
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isPasswordLoading}
                className={`px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 ${
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
    </DashboardLayout>
  );
};

export default SettingsPage;
