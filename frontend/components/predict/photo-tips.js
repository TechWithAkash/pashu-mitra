"use client";

import { useLanguage } from "@/context/language-context";
import { motion } from "framer-motion";
import { Sun, Focus, Hand, CircleDot } from "lucide-react";

const tips = [
  { icon: Sun, key: "predict.tip1" },
  { icon: Focus, key: "predict.tip2" },
  { icon: Hand, key: "predict.tip3" },
  { icon: CircleDot, key: "predict.tip4" },
];

export default function PhotoTips() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border/60 bg-muted/20 p-5"
    >
      <p className="text-sm font-semibold text-foreground/80 mb-3">
        {t("predict.photoTips")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tips.map(({ icon: Icon, key }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className="flex items-start gap-2.5 rounded-xl bg-background/60 border border-border/40 px-3.5 py-3"
          >
            <div className="flex items-center justify-center shrink-0 h-8 w-8 rounded-lg bg-primary/8">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              {t(key)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
