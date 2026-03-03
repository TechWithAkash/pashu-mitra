"use client";

import Link from "next/link";
import { Shield, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import FarmScene from "@/components/illustrations/farm-scene";

export default function AuthLayout({ children }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex">
      {/* Left panel - dark gradient with branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-12">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.13_0.02_260)] via-[oklch(0.16_0.03_200)] to-[oklch(0.11_0.025_155)]" />

        {/* Animated mesh gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.55 0.16 155 / 0.15), transparent 70%)",
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -25, 15, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.58 0.13 200 / 0.12), transparent 70%)",
            }}
            animate={{
              x: [0, -40, 20, 0],
              y: [0, 30, -20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.65 0.18 155 / 0.08), transparent 70%)",
            }}
            animate={{
              scale: [1, 1.2, 0.95, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-10">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Pashumitra
            </span>
          </Link>

          {/* Tagline */}
          <motion.h1
            className="text-3xl font-bold text-white mb-4 leading-tight text-balance"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {t("auth.tagline")}
          </motion.h1>

          <motion.p
            className="text-[15px] text-white/60 leading-relaxed mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {t("auth.description")}
          </motion.p>

          {/* Social proof card */}
          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.45,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-emerald-400 text-emerald-400"
                />
              ))}
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              &ldquo;{t("auth.testimonial")}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-semibold text-white">
                R
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">
                  {t("auth.testimonialAuthor")}
                </p>
                <p className="text-xs text-white/40">
                  {t("auth.testimonialRole")}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Farm scene illustration at bottom of left panel */}
        <div className="absolute bottom-0 left-0 right-0 opacity-40">
          <FarmScene className="w-full" />
        </div>
      </div>

      {/* Right panel - form area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 bg-background relative">
        {/* Subtle dot pattern on right panel */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.13 0.02 260) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative w-full max-w-[420px]">
          {/* Mobile: small farm scene + logo */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div className="p-2 bg-primary rounded-xl">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight">
                  Pashumitra
                </span>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border/30 mb-2">
              <FarmScene className="w-full opacity-60" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
