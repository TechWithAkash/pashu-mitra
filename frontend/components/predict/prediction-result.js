"use client";

import { motion } from "framer-motion";
import { ShieldAlert, HeartPulse, AlertTriangle, Info } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import QualityWarning from "./quality-warning";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function PredictionResult({ result }) {
  const { t } = useLanguage();

  if (!result) return null;

  const isLSD = result.prediction?.toLowerCase().includes("lumpy");
  const confidence = result.confidence;

  // Determine traffic-light state
  let state; // "red" | "green" | "yellow"
  if (confidence < 0.7) {
    state = "yellow";
  } else if (isLSD) {
    state = "red";
  } else {
    state = "green";
  }

  // State-based config
  const config = {
    red: {
      Icon: ShieldAlert,
      bg: "bg-destructive/5",
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      borderColor: "border-destructive/20",
      title: t("result.diseased"),
      description: t("result.diseasedDesc"),
    },
    green: {
      Icon: HeartPulse,
      bg: "bg-healthy/5",
      iconBg: "bg-healthy/10",
      iconColor: "text-healthy",
      borderColor: "border-healthy/20",
      title: t("result.healthy"),
      description: t("result.healthyDesc"),
    },
    yellow: {
      Icon: AlertTriangle,
      bg: "bg-warning-amber/5",
      iconBg: "bg-warning-amber/10",
      iconColor: "text-warning-amber",
      borderColor: "border-warning-amber/20",
      title: t("result.uncertain"),
      description: t("result.uncertainDesc"),
    },
  };

  const { Icon, bg, iconBg, iconColor, borderColor, title, description } = config[state];

  // Confidence text
  let confidenceText;
  if (confidence >= 0.85) {
    confidenceText = t("result.confidenceHigh");
  } else if (confidence >= 0.7) {
    confidenceText = t("result.confidenceMedium");
  } else {
    confidenceText = t("result.confidenceLow");
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className={`rounded-2xl border ${borderColor} ${bg} shadow-elevated overflow-hidden`}
      >
        {/* Traffic-light header */}
        <div className="px-6 pt-8 pb-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`flex items-center justify-center h-16 w-16 rounded-full ${iconBg} mb-4`}
          >
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            {title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Confidence text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="text-xs text-muted-foreground/70 mt-3"
          >
            {confidenceText}
          </motion.p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          <QualityWarning warning={result.quality_warning} />

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Advice */}
          {result.advice && (
            <motion.div
              variants={itemVariants}
              className="flex gap-3.5 p-4 rounded-xl bg-muted/30 border border-border/40"
            >
              <div className="flex items-center justify-center shrink-0 h-9 w-9 rounded-xl bg-primary/8">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground mb-1">
                  {t("result.whatToDoNext")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.advice}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
