"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function QualityWarning({ warning }) {
  const { t } = useLanguage();

  if (!warning) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative flex items-start gap-3 rounded-xl border border-warning-amber/20 bg-warning-amber/5 px-4 py-3.5 overflow-hidden"
    >
      {/* Left accent border */}
      <div className="absolute left-0 inset-y-0 w-1 bg-warning-amber/60 rounded-l-xl" />

      <div className="flex items-center justify-center shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-warning-amber/10">
        <AlertTriangle className="h-4 w-4 text-warning-amber" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground/90 mb-0.5">
          {t("result.qualityWarning")}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {warning}
        </p>
      </div>
    </motion.div>
  );
}
