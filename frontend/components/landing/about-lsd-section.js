"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, Bug, Thermometer, Globe } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import CowIllustration from "@/components/illustrations/cow-illustration";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const facts = [
  {
    icon: Bug,
    titleKey: "about.lsd1Title",
    textKey: "about.lsd1Text",
    accent: "border-l-emerald-500",
  },
  {
    icon: AlertTriangle,
    titleKey: "about.lsd2Title",
    textKey: "about.lsd2Text",
    accent: "border-l-amber-500",
  },
  {
    icon: Thermometer,
    titleKey: "about.lsd3Title",
    textKey: "about.lsd3Text",
    accent: "border-l-rose-500",
  },
  {
    icon: Globe,
    titleKey: "about.lsd4Title",
    textKey: "about.lsd4Text",
    accent: "border-l-blue-500",
  },
];

export default function AboutLsdSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-32 bg-background relative">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.13 0.02 260) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            {t("about.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-balance">
            {t("about.heading")}{" "}
            <span className="gradient-text">{t("about.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed text-balance">
            {t("about.subtext")}
          </p>
        </motion.div>

        {/* Layout: illustration + cards */}
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Cow illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 flex justify-center"
          >
            <CowIllustration showMarkers className="w-full max-w-[240px] sm:max-w-[320px]" />
          </motion.div>

          {/* Cards grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-3 grid sm:grid-cols-2 gap-5"
          >
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <motion.div
                  key={fact.titleKey}
                  variants={cardVariants}
                  className={`group bg-card rounded-2xl p-7 shadow-premium border border-border/50 border-l-4 ${fact.accent} hover:shadow-elevated transition-all duration-500`}
                >
                  <div className="flex gap-5">
                    <div className="shrink-0 mt-0.5">
                      <div className="p-2.5 rounded-xl bg-muted/50">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight mb-2.5">
                        {t(fact.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(fact.textKey)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
