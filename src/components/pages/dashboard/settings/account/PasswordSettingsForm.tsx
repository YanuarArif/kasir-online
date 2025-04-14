"use client";

import { useState, useEffect } from "react";
import { updatePassword } from "@/actions/update-password";
import {
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Progress } from "@/components/ui/progress"; // Assuming Progress is used for strength

interface PasswordSettingsFormProps {
  // Add any necessary props, e.g., user ID if needed by the action
}

export default function PasswordSettingsForm(
  _props: PasswordSettingsFormProps
) {
  // Password form state
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password form values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Calculate password strength when newPassword changes
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength += 25; // Length
    if (/[A-Z]/.test(newPassword)) strength += 25; // Uppercase
    if (/[0-9]/.test(newPassword)) strength += 25; // Number
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25; // Special char

    setPasswordStrength(strength);
  }, [newPassword]);

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        setPasswordStrength(0); // Reset strength indicator
      }
    } catch (err) {
      setPasswordError("Terjadi kesalahan saat memperbarui password.");
      console.error(err);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess(null);
    setPasswordError(null);
    setPasswordStrength(0);
  };

  // Helper function for password strength color (used directly in JSX now)
  // const getPasswordStrengthColor = () => {
  //   if (passwordStrength < 50) return "bg-red-500";
  //   if (passwordStrength < 75) return "bg-yellow-500";
  //   return "bg-green-500";
  // };

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-white dark:from-gray-800 dark:to-gray-750">
        <div className="p-2.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
          <KeyIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Ubah Password
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Perbarui password akun Anda
          </p>
        </div>
      </div>

      <form className="p-8 space-y-8" onSubmit={handlePasswordSubmit}>
        <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Pengaturan Password
          </h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="current-password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                  placeholder="Masukkan password saat ini"
                  required
                  autoComplete="current-password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password Baru
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="new-password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                  placeholder="Masukkan password baru"
                  required
                  autoComplete="new-password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
                  placeholder="Konfirmasi password baru"
                  required
                  autoComplete="new-password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="sm:col-span-2 space-y-2 mt-2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kekuatan Password:
                  </label>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${passwordStrength < 50 ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : passwordStrength < 75 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"}`}
                  >
                    {passwordStrength < 50 && "Lemah"}
                    {passwordStrength >= 50 &&
                      passwordStrength < 75 &&
                      "Sedang"}
                    {passwordStrength >= 75 && "Kuat"}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className={`h-2 ${passwordStrength < 50 ? "bg-red-100 dark:bg-red-900/30" : passwordStrength < 75 ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-green-100 dark:bg-green-900/30"}`}
                />

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Minimal 8 karakter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${/[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Huruf besar
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${/[0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Angka
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Karakter khusus
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {passwordSuccess && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-100 dark:border-green-800/30 shadow-sm animate-fade-in">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-300">
                {passwordSuccess}
              </p>
            </div>
          </div>
        )}

        {passwordError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-800/30 shadow-sm animate-fade-in">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
              <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-300">
                {passwordError}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 mt-8">
          <button
            type="button"
            onClick={handleReset}
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
  );
}
