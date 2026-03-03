"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center max-w-md"
      >
        {/* Large 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[120px] sm:text-[150px] font-bold leading-none tracking-tighter gradient-text select-none"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-3 mt-2 mb-10"
        >
          <h2 className="text-xl font-semibold text-foreground">
            Page not found
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed text-balance max-w-xs mx-auto">
            The page you are looking for does not exist or has been moved to a different location.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button
            asChild
            className="rounded-xl px-6 h-10"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Subtle decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
}
