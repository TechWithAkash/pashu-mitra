"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function GradcamViewer({ originalUrl, gradcamBase64 }) {
  const { t } = useLanguage();

  if (!gradcamBase64) return null;

  const gradcamSrc = `data:image/png;base64,${gradcamBase64}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-border/60 bg-card shadow-elevated overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-2.5">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-muted/60">
          <Eye className="h-[18px] w-[18px] text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">
          {t("gradcam.title")}
        </h3>
      </div>

      {/* Side-by-side content */}
      <div className="px-6 pb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 text-center">
              {t("gradcam.original")}
            </p>
            <div className="rounded-xl overflow-hidden border border-border/40 bg-muted/20">
              <img
                src={originalUrl}
                alt={t("gradcam.original")}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 text-center">
              {t("gradcam.highlighted")}
            </p>
            <div className="rounded-xl overflow-hidden border border-border/40 bg-muted/20">
              <img
                src={gradcamSrc}
                alt={t("gradcam.highlighted")}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("gradcam.explanation")}
        </p>
      </div>
    </motion.div>
  );
}
