"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Zap, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import HeroIllustration from "@/components/illustrations/hero-illustration";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[oklch(0.22_0.04_155)] via-[oklch(0.18_0.05_170)] to-[oklch(0.14_0.03_200)]">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.16 155 / 0.4), transparent 70%)",
            animation: "drift1 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, oklch(0.58 0.13 200 / 0.5), transparent 70%)",
            animation: "drift2 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, oklch(0.65 0.18 155 / 0.3), transparent 70%)",
            animation: "drift3 18s ease-in-out infinite",
          }}
        />
      </div>

      {/* Grid dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-[20%] right-[12%] w-3 h-3 rounded-full bg-emerald-400/30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[30%] left-[8%] w-2 h-2 rounded-full bg-teal-400/25"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[60%] right-[30%] w-4 h-4 rotate-45 border border-emerald-400/20"
        animate={{ y: [0, -12, 0], rotate: [45, 90, 45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle gradient vignette at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[oklch(0.14_0.03_200)] to-transparent" />

      {/* Content — split layout */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-center">
          {/* Left — text (60%) */}
          <div className="lg:col-span-3">
            {/* Badge pill */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-white/80 text-sm font-medium mb-10">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                {t("landing.badge")}
              </div>
            </motion.div>

            {/* Heading — larger */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-8"
            >
              {t("landing.heading1")}
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {t("landing.heading2")}
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg sm:text-xl text-white/55 mb-10 max-w-xl leading-relaxed text-balance"
            >
              {t("landing.subtext")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4 mb-4"
            >
              <Button
                size="lg"
                asChild
                className="bg-white text-[oklch(0.22_0.04_155)] hover:bg-white/90 text-base font-semibold px-6 sm:px-8 h-13 rounded-full shadow-[0_0_32px_rgba(255,255,255,0.15)] hover:shadow-[0_0_48px_rgba(255,255,255,0.25)] transition-all duration-300"
              >
                <Link href="/signup">
                  {t("landing.startFree")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="text-white/70 hover:text-white hover:bg-white/[0.08] text-base font-medium px-6 sm:px-8 h-13 rounded-full border border-white/[0.12] transition-all duration-300"
              >
                <a href="#how-it-works">{t("landing.learnMore")}</a>
              </Button>
            </motion.div>

            {/* No credit card text */}
            <motion.p
              custom={3.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-sm text-white/35 mb-16"
            >
              {t("landing.noCreditCard")}
            </motion.p>

            {/* Trust indicators with icons */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm"
            >
              {[
                { labelKey: "landing.trust1", icon: Target },
                { labelKey: "landing.trust2", icon: Zap },
                { labelKey: "landing.trust3", icon: Eye },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.labelKey} className="flex items-center gap-2.5 text-white/45">
                    <Icon className="h-4 w-4 text-emerald-400/60" />
                    <span className="font-medium">{t(item.labelKey)}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right — illustration (40%) */}
          <motion.div
            className="lg:col-span-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroIllustration className="w-full max-w-[420px] lg:max-w-none drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
