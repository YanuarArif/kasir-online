"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { PaintBrushIcon, SunIcon, MoonIcon, ComputerDesktopIcon, CheckIcon } from "@heroicons/react/24/outline";

const fontOptions = [
  { value: "system", label: "System Default" },
  { value: "sans", label: "Sans Serif" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
];

const themeOptions = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: ComputerDesktopIcon },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedFont, setSelectedFont] = useState("system");
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <PaintBrushIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Pengaturan Tampilan
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Sesuaikan tampilan aplikasi sesuai preferensi Anda
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Theme Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Tema
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pilih tema yang ingin Anda gunakan untuk aplikasi
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  theme === option.value
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 bg-white dark:bg-gray-800"
                }`}
              >
                {theme === option.value && (
                  <div className="absolute top-2 right-2 h-5 w-5 bg-indigo-500 dark:bg-indigo-400 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <option.icon className={`h-8 w-8 mb-2 ${
                  theme === option.value
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400"
                }`} />
                <span className={`text-sm font-medium ${
                  theme === option.value
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Selection */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Font
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pilih jenis font yang ingin Anda gunakan
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {fontOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFont(option.value)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedFont === option.value
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 bg-white dark:bg-gray-800"
                }`}
              >
                {selectedFont === option.value && (
                  <div className="absolute top-2 right-2 h-5 w-5 bg-indigo-500 dark:bg-indigo-400 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="text-center">
                  <span className={`text-sm font-medium ${
                    selectedFont === option.value
                      ? "text-indigo-700 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}>
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Animation Settings */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Animasi & Tampilan
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sesuaikan pengalaman visual aplikasi
          </p>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktifkan Animasi</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Tampilkan animasi transisi dan efek visual
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={animationEnabled}
                  onChange={() => setAnimationEnabled(!animationEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Kurangi Gerakan</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Kurangi efek animasi untuk aksesibilitas yang lebih baik
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={reducedMotion}
                  onChange={() => setReducedMotion(!reducedMotion)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode Kompak</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Tampilkan lebih banyak konten dengan mengurangi padding dan margin
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={compactMode}
                  onChange={() => setCompactMode(!compactMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            type="button"
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 hover:shadow-md"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
