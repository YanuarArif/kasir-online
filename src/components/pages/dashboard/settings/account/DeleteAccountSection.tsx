"use client";

import { useState } from "react";
import { TrashIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function DeleteAccountSection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteRequest = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
    setError(null);
  };

  const handleConfirmDelete = async () => {
    // This is a placeholder for actual delete functionality
    // In a real implementation, you would call a server action to delete the account
    
    if (deleteConfirmText !== "HAPUS") {
      setError("Silakan ketik 'HAPUS' untuk mengonfirmasi");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just show an alert since we don't have the actual delete functionality
      alert("Fitur hapus akun belum diimplementasikan. Ini hanya UI demo.");
      
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus akun.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-gray-750">
        <TrashIcon className="h-7 w-7 text-red-600 dark:text-red-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Hapus Akun
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Hapus akun Anda secara permanen
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-100 dark:border-red-800/30">
          <p className="text-sm text-red-800 dark:text-red-300">
            <strong>Peringatan:</strong> Menghapus akun Anda akan menghapus semua data terkait secara permanen. 
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={handleDeleteRequest}
            className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 dark:bg-red-700 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
          >
            Hapus Akun Saya
          </button>
        ) : (
          <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Untuk mengonfirmasi, ketik <strong>HAPUS</strong> di bawah ini:
            </p>
            
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-gray-100"
              placeholder="Ketik HAPUS"
            />
            
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <ExclamationCircleIcon className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Batal
              </button>
              
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200 ${
                  isDeleting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isDeleting ? "Menghapus..." : "Konfirmasi Hapus"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
