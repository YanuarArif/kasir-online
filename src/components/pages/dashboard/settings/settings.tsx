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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Profile Settings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <UserCircleIcon className="h-6 w-6 text-gray-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Profil Pengguna
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Kelola informasi pribadi dan preferensi akun Anda
              </p>
            </div>
          </div>

          <form
            className="p-6"
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
                  // Update the session to reflect the new profile data
                  await update({
                    ...user,
                    name,
                    username,
                    image: imageUrl,
                  });
                  // Refresh the page to show the updated data
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan username"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alamat Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={user.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="Alamat email tidak dapat diubah"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email tidak dapat diubah
                </p>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL Foto Profil
                </label>
                <input
                  type="url"
                  name="image"
                  id="image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Masukkan URL gambar dari internet untuk foto profil Anda
                </p>
              </div>

              {/* Preview image if URL is provided */}
              {imageUrl && (
                <div className="md:col-span-2 flex justify-center">
                  <div className="mt-2 h-24 w-24 overflow-hidden rounded-full bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt="Preview foto profil"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      onError={() => {
                        // Handle error by setting a state variable instead
                        setImageUrl(
                          "https://via.placeholder.com/150?text=Error"
                        );
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Success message */}
            {profileSuccess && (
              <div className="mt-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckCircleIcon
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {profileSuccess}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {profileError && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {profileError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setName(user.name || "");
                  setUsername(user.username || "");
                  setImageUrl(user.image || "");
                  setProfileSuccess(null);
                  setProfileError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isProfileLoading}
                className={`px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
                  isProfileLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isProfileLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <KeyIcon className="h-6 w-6 text-gray-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Ubah Password
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Perbarui password akun Anda
              </p>
            </div>
          </div>

          <form
            className="p-6"
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
                  // Clear form fields
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  name="current-password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan password saat ini"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password Baru
                </label>
                <input
                  type="password"
                  name="new-password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan password baru"
                  minLength={6}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Password minimal 6 karakter
                </p>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan kembali password baru"
                  required
                />
              </div>
            </div>

            {/* Success message */}
            {passwordSuccess && (
              <div className="mt-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckCircleIcon
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {passwordSuccess}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {passwordError && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {passwordError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordSuccess(null);
                  setPasswordError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isPasswordLoading}
                className={`px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
                  isPasswordLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isPasswordLoading ? "Memperbarui..." : "Perbarui Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
