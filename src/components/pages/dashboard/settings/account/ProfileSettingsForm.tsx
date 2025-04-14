"use client";

import { useState, useRef, useEffect } from "react";
import { updateProfile } from "@/actions/update-profile";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  UserCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Re-define or import the User interface if needed
interface User {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  image: string | null;
  phone: string | null;
  bio: string | null;
}

interface ProfileSettingsFormProps {
  user: User;
}

export default function ProfileSettingsForm({
  user,
}: ProfileSettingsFormProps) {
  const router = useRouter();
  const { update } = useSession(); // Get update function from session

  // Profile form state
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isDraftSaved, setIsDraftSaved] = useState(false); // Keep track if a draft exists

  // Form values
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [bio, setBio] = useState(user.bio || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-save draft when form values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only save draft if any field has been changed from original values
      if (
        name !== (user.name || "") ||
        username !== (user.username || "") ||
        imageUrl !== (user.image || "") ||
        phone !== (user.phone || "") ||
        bio !== (user.bio || "")
      ) {
        localStorage.setItem(
          "profileDraft",
          JSON.stringify({
            name,
            username,
            imageUrl,
            phone,
            bio,
          })
        );
        setIsDraftSaved(true);
      } else {
        // If values match original, remove draft and reset flag
        localStorage.removeItem("profileDraft");
        setIsDraftSaved(false);
      }
    }, 1500); // Save after 1.5 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [name, username, imageUrl, phone, bio, user]);

  // Load draft on initial render
  useEffect(() => {
    const savedDraft = localStorage.getItem("profileDraft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // Only apply draft if it differs from current user data
        if (
          draft.name !== (user.name || "") ||
          draft.username !== (user.username || "") ||
          draft.imageUrl !== (user.image || "") ||
          draft.phone !== (user.phone || "") ||
          draft.bio !== (user.bio || "")
        ) {
          setName(draft.name || user.name || "");
          setUsername(draft.username || user.username || "");
          setImageUrl(draft.imageUrl || user.image || "");
          setPhone(draft.phone || user.phone || "");
          setBio(draft.bio || user.bio || "");
          setIsDraftSaved(true); // Indicate that a draft was loaded
        } else {
          // If draft matches current data, remove it
          localStorage.removeItem("profileDraft");
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        localStorage.removeItem("profileDraft"); // Clear corrupted draft
      }
    }
  }, [user]); // Rerun only when user prop changes

  // Handle file drop for image upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImageUrl(event.target.result.toString());
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const result = await updateProfile({
        name,
        username,
        image: imageUrl,
        phone,
        bio,
      });

      if (result.error) {
        setProfileError(result.error);
      } else {
        setProfileSuccess("Profil berhasil diperbarui!");
        // Clear the draft after successful submission
        localStorage.removeItem("profileDraft");
        setIsDraftSaved(false);
        // Update the session immediately
        await update({ user: { name, username, image: imageUrl, phone, bio } });
        // router.refresh(); // Consider if refresh is needed or session update is enough
      }
    } catch (err) {
      setProfileError("Terjadi kesalahan saat memperbarui profil.");
      console.error(err);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleReset = () => {
    setName(user.name || "");
    setUsername(user.username || "");
    setImageUrl(user.image || "");
    setPhone(user.phone || "");
    setBio(user.bio || "");
    setProfileSuccess(null);
    setProfileError(null);
    localStorage.removeItem("profileDraft");
    setIsDraftSaved(false);
  };

  return (
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

      <form className="p-6 space-y-6" onSubmit={handleProfileSubmit}>
        {isDraftSaved && (
          <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 mb-4">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Perubahan yang belum disimpan terdeteksi (tersimpan otomatis
              sebagai draf).
            </p>
          </div>
        )}
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

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
              placeholder="+62 812 3456 7890"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-100"
              placeholder="Ceritakan sedikit tentang diri Anda..."
            />
          </div>

          <div
            className={`sm:col-span-2 flex flex-col items-center ${isDragging ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"} border-2 rounded-lg p-6 transition-all duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="text-center space-y-4">
              {imageUrl ? (
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 ring-2 ring-indigo-100 dark:ring-indigo-800 transition-all duration-300 hover:ring-indigo-300 dark:hover:ring-indigo-600">
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
              ) : (
                <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserCircleIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                </div>
              )}

              <div>
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 border border-indigo-300 dark:border-indigo-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
                >
                  {imageUrl ? "Ganti Foto" : "Unggah Foto"}
                </button>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Seret dan lepas foto di sini, atau klik untuk memilih file
                </p>
              </div>
            </div>
          </div>
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
            onClick={handleReset}
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
  );
}
