"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Zap, Eye, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";

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
    <section className="relative overflow-hidden bg-background pt-24 pb-12 lg:pt-32 lg:pb-20">
      {/* Soft background shape for aesthetics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl opacity-60" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-secondary/10 blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Text Content */}
          <div className="lg:pr-8">
            {/* Badge */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                <Sparkles className="h-4 w-4" />
                {t("landing.badge")}
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] mb-4"
            >
              {t("landing.heading1")} <br className="hidden sm:block" />
              <span className="text-primary">{t("landing.heading2")}</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg"
            >
              {t("landing.subtext")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button
                size="lg"
                asChild
                className="bg-primary text-white hover:bg-primary/90 text-base font-semibold px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/signup">
                  {t("landing.startFree")}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-foreground hover:bg-muted text-base font-medium px-8 h-14 rounded-full border-border transition-all"
              >
                <a href="#how-it-works">{t("landing.learnMore")}</a>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap items-center gap-6 text-sm font-medium text-foreground/70"
            >
              {[
                { labelKey: "landing.trust1", icon: CheckCircle2 },
                { labelKey: "landing.trust2", icon: CheckCircle2 },
                { labelKey: "landing.trust3", icon: CheckCircle2 },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-green-600" />
                    <span>{t(item.labelKey)}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Visual Image */}
          <motion.div
            custom={2}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 bg-white">
              <Image
                src="/images/healthy-cattle-hero.png"
                alt="Healthy Cattle"
                width={700}
                height={500}
                className="w-full object-cover"
                priority
              />

              {/* Product Preview Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:left-[-20px] bg-white p-5 rounded-2xl shadow-xl border border-gray-100 animate-in slide-in-from-bottom-5 fade-in duration-1000 delay-500">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Health Check Complete</h4>
                    <p className="text-xs text-gray-500 font-medium">99.8% Confidence • Healthy</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
