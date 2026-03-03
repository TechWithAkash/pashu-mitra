"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Camera, BrainCircuit, ClipboardCheck } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HowItWorksSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      icon: Camera,
      number: "01",
      titleKey: "howItWorks.step1Title",
      descKey: "howItWorks.step1Desc",
    },
    {
      icon: BrainCircuit,
      number: "02",
      titleKey: "howItWorks.step2Title",
      descKey: "howItWorks.step2Desc",
    },
    {
      icon: ClipboardCheck,
      number: "03",
      titleKey: "howItWorks.step3Title",
      descKey: "howItWorks.step3Desc",
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-muted/30 relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
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
            {t("howItWorks.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-balance">
            {t("howItWorks.heading")}{" "}
            <span className="gradient-text">{t("howItWorks.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("howItWorks.subtext")}
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 lg:gap-12 relative"
        >
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number & icon container */}
                <div className="relative mb-8">
                  <div className="w-[120px] h-[120px] rounded-3xl bg-card shadow-premium border border-border/50 flex items-center justify-center relative">
                    <Icon className="h-10 w-10 text-primary/80" />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-card shadow-elevated border border-border/50 flex items-center justify-center">
                    <span className="text-sm font-bold gradient-text">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold tracking-tight mb-3">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {t(step.descKey)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
