"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-difference"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              background: `hsl(${Math.random() * 360}, 70%, 60%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, Math.random() + 0.5],
              opacity: [0.5, 0.8],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Glitch effect 404 */}
        <motion.h1
          className="text-[12rem] font-bold leading-none tracking-tighter relative text-[var(--foreground)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="relative inline-block">
            <span className="absolute inset-0 text-[#ff0000] animate-glitch-1">
              404
            </span>
            <span className="absolute inset-0 text-[#00ff00] animate-glitch-2">
              404
            </span>
            <span className="absolute inset-0 text-[#0000ff] animate-glitch-3">
              404
            </span>
            404
          </span>
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-2xl mt-8 mb-12 text-[var(--foreground)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Oops! Looks like you&apos;ve ventured into the void
        </motion.p>

        {/* Home button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/"
            className="inline-block px-8 py-3 text-lg font-medium rounded-full 
                     bg-[var(--foreground)] text-[var(--background)]
                     hover:scale-105 transition-transform
                     hover:shadow-lg"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
