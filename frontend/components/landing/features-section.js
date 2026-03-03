"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Zap,
  Layers,
  History,
  Users,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
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

export default function FeaturesSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const features = [
    {
      icon: Zap,
      titleKey: "features.f1Title",
      descKey: "features.f1Desc",
      color: "bg-emerald-500/10 text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      icon: Layers,
      titleKey: "features.f2Title",
      descKey: "features.f2Desc",
      color: "bg-blue-500/10 text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      icon: History,
      titleKey: "features.f3Title",
      descKey: "features.f3Desc",
      color: "bg-violet-500/10 text-violet-600",
      iconBg: "bg-violet-50",
    },
    {
      icon: Users,
      titleKey: "features.f4Title",
      descKey: "features.f4Desc",
      color: "bg-amber-500/10 text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      icon: Stethoscope,
      titleKey: "features.f5Title",
      descKey: "features.f5Desc",
      color: "bg-rose-500/10 text-rose-600",
      iconBg: "bg-rose-50",
    },
    {
      icon: ShieldCheck,
      titleKey: "features.f6Title",
      descKey: "features.f6Desc",
      color: "bg-teal-500/10 text-teal-600",
      iconBg: "bg-teal-50",
    },
  ];

  return (
    <section id="features" className="py-32 bg-background relative">
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
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            {t("features.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-balance">
            {t("features.heading")}{" "}
            <span className="gradient-text">{t("features.headingHighlight")}</span> {t("features.headingSuffix")}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed text-balance">
            {t("features.subtext")}
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.titleKey}
                variants={cardVariants}
                className="group relative bg-card rounded-2xl p-7 shadow-premium hover:shadow-elevated transition-all duration-500 border border-border/50 hover:border-primary/15"
              >
                <div
                  className={`inline-flex p-3 rounded-2xl ${feature.iconBg} mb-5 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-5 w-5 ${feature.color.split(" ")[1]}`} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight mb-2.5">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
