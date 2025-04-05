"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/update-profile";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfileImageForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateProfile({ image: imageUrl });
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Foto profil berhasil diperbarui!");
        // Update the session to reflect the new image
        await update({
          ...session,
          user: {
            ...session?.user,
            image: imageUrl,
          },
        });
        // Refresh the page to show the updated image
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memperbarui foto profil.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 bg-white shadow sm:rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Perbarui Foto Profil
      </h3>
      
      {/* Current profile image */}
      {session?.user?.image && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 mb-2">Foto Profil Saat Ini</p>
          <div className="h-24 w-24 rounded-full overflow-hidden">
            <Image 
              src={session.user.image}
              alt="Foto profil saat ini"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            URL Gambar
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="https://example.com/image.jpg"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Masukkan URL gambar dari internet untuk foto profil Anda
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Sukses</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{success}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Memperbarui..." : "Perbarui Foto Profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
