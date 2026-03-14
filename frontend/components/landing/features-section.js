"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  AlertTriangle,
  TrendingDown,
  Stethoscope,
  ScanHeart,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FeaturesSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    { icon: AlertTriangle, titleKey: "features.p1Title", descKey: "features.p1Desc", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: TrendingDown, titleKey: "features.p2Title", descKey: "features.p2Desc", color: "text-red-500", bg: "bg-red-50" },
    { icon: Stethoscope, titleKey: "features.p3Title", descKey: "features.p3Desc", color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const benefits = [
    { icon: ScanHeart, titleKey: "features.b1Title", descKey: "features.b1Desc", color: "text-primary", bg: "bg-primary/10" },
    { icon: ShieldCheck, titleKey: "features.b2Title", descKey: "features.b2Desc", color: "text-secondary", bg: "bg-secondary/10" },
    { icon: ThumbsUp, titleKey: "features.b3Title", descKey: "features.b3Desc", color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wide mb-6">
            {t("features.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            {t("features.heading")}{" "}
            <span className="text-primary">{t("features.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            {t("features.subtext")}
          </p>
        </motion.div>

        {/* The Problem Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-3 gap-6 mb-16"
        >
          {problems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} variants={cardVariants} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex px-4 py-4 rounded-xl ${item.bg} mb-4`}>
                  <Icon className={`h-8 w-8 ${item.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(item.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(item.descKey)}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Divider with "The Solution" text */}
        <div className="flex items-center justify-center my-16">
          <div className="w-full h-px bg-gray-200"></div>
          <span className="shrink-0 px-6 text-sm font-bold uppercase tracking-widest text-primary bg-white">
            The Solution
          </span>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* The Benefits Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-3 gap-6"
        >
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} variants={cardVariants} className="bg-white border-2 border-primary/10 rounded-2xl p-6 shadow-sm hover:border-primary/40 hover:shadow-lg transition-all">
                <div className={`inline-flex px-4 py-4 rounded-xl ${item.bg} mb-4`}>
                  <Icon className={`h-8 w-8 ${item.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(item.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(item.descKey)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
