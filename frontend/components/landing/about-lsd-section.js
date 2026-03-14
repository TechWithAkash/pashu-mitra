"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Info, Shield, Droplets } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const guides = [
  {
    icon: Info,
    titleKey: "about.lsd1Title",
    textKey: "about.lsd1Text",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    icon: Shield,
    titleKey: "about.lsd2Title",
    textKey: "about.lsd2Text",
    color: "text-primary",
    bg: "bg-primary/20",
  },
  {
    icon: Droplets,
    titleKey: "about.lsd3Title",
    textKey: "about.lsd3Text",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
];

export default function AboutLsdSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 bg-muted/30 relative">
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wide mb-6">
            {t("about.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            {t("about.heading")} <span className="text-primary">{t("about.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            {t("about.subtext")}
          </p>
        </motion.div>

        {/* Guides Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {guides.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl ${guide.bg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${guide.color}`} strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t(guide.titleKey)}
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm">
                  {t(guide.textKey)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
