"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/language-context";
import StepCamera from "@/components/illustrations/step-camera";
import StepAiAnalysis from "@/components/illustrations/step-ai-analysis";
import StepResults from "@/components/illustrations/step-results";

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
      Illustration: StepCamera,
      number: "01",
      titleKey: "howItWorks.step1Title",
      descKey: "howItWorks.step1Desc",
    },
    {
      Illustration: StepAiAnalysis,
      number: "02",
      titleKey: "howItWorks.step2Title",
      descKey: "howItWorks.step2Desc",
    },
    {
      Illustration: StepResults,
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
          {/* Connecting gradient line on desktop */}
          <div className="hidden md:block absolute top-[70px] left-[16%] right-[16%] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-full" />
          </div>

          {steps.map((step) => {
            const { Illustration } = step;
            return (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step illustration in circular container */}
                <div className="relative mb-8">
                  <div className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] rounded-full bg-card shadow-premium border border-border/50 flex items-center justify-center relative overflow-hidden">
                    <Illustration className="w-[75px] h-[75px] sm:w-[100px] sm:h-[100px]" />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center">
                    <span className="text-sm font-bold">
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
