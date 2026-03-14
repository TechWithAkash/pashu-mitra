"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/language-context";
import { Camera, Cpu, ShieldCheck } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HowItWorksSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: Camera,
      number: "1",
      titleKey: "howItWorks.step1Title",
      descKey: "howItWorks.step1Desc",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Cpu,
      number: "2",
      titleKey: "howItWorks.step2Title",
      descKey: "howItWorks.step2Desc",
      color: "text-primary",
      bg: "bg-primary/20",
    },
    {
      icon: ShieldCheck,
      number: "3",
      titleKey: "howItWorks.step3Title",
      descKey: "howItWorks.step3Desc",
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wide mb-6">
            {t("howItWorks.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            {t("howItWorks.heading")} <span className="text-primary">{t("howItWorks.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            {t("howItWorks.subtext")}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 relative items-start"
        >
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[16%] right-[16%] h-[2px] bg-gray-200 border-t-2 border-dashed border-gray-300 -z-10" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                {/* Step Icon */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${step.bg} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className={`w-10 h-10 ${step.color}`} strokeWidth={1.5} />
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-white shadow-md flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t(step.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
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
