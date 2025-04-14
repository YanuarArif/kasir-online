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

export default function PasswordSettingsForm(props: PasswordSettingsFormProps) {
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
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

      <form className="p-6 space-y-6" onSubmit={handlePasswordSubmit}>
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
              autoComplete="current-password"
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
              autoComplete="new-password"
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
              autoComplete="new-password"
            />
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Kekuatan Password:
              </label>
              <Progress value={passwordStrength} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {passwordStrength < 50 && "Lemah"}
                {passwordStrength >= 50 && passwordStrength < 75 && "Sedang"}
                {passwordStrength >= 75 && "Kuat"}
              </p>
            </div>
          )}
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
