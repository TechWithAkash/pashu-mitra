"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/language-context";
import CowIllustration from "@/components/illustrations/cow-illustration";

export default function CtaSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Dark emerald gradient card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.22_0.06_155)] via-[oklch(0.18_0.05_165)] to-[oklch(0.14_0.04_180)]" />

          {/* Gradient mesh accents */}
          <div
            className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-25"
            style={{
              background: "radial-gradient(circle, oklch(0.55 0.16 155 / 0.3), transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-20%] left-[-5%] w-[300px] h-[300px] rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, oklch(0.58 0.13 200 / 0.3), transparent 70%)",
            }}
          />

          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Content — split layout */}
          <div className="relative grid lg:grid-cols-5 gap-8 items-center p-10 sm:p-14 lg:p-16">
            {/* Left — text */}
            <div className="lg:col-span-3 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance">
                {t("cta.heading")}{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  {t("cta.headingHighlight")}
                </span>
                {t("cta.questionMark")}
              </h2>
              <p className="text-lg text-white/55 max-w-xl leading-relaxed text-balance">
                {t("cta.subtext")}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-[oklch(0.22_0.04_155)] hover:bg-white/90 text-base font-semibold px-8 h-13 rounded-full shadow-[0_0_32px_rgba(255,255,255,0.15)] hover:shadow-[0_0_48px_rgba(255,255,255,0.25)] transition-all duration-300"
                >
                  <Link href="/signup">
                    {t("cta.createAccount")}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  asChild
                  className="text-white/70 hover:text-white hover:bg-white/[0.08] text-base font-medium px-8 h-13 rounded-full border border-white/[0.12] transition-all duration-300"
                >
                  <Link href="/login">{t("cta.signIn")}</Link>
                </Button>
              </div>
            </div>

            {/* Right — illustration */}
            <div className="lg:col-span-2 hidden lg:flex justify-center">
              <CowIllustration className="w-full max-w-[250px] opacity-80" />
            </div>
          </div>

          {/* Outer glow shadow */}
          <div className="absolute inset-0 rounded-3xl shadow-[0_0_80px_oklch(0.55_0.16_155/0.12)] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
