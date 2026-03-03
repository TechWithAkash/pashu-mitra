"use client";

import { motion } from "framer-motion";

export default function ConfidenceGauge({ confidence }) {
  const percent = (confidence * 100).toFixed(1);
  const numPercent = parseFloat(percent);

  let color = "text-healthy";
  let barColor = "bg-healthy";
  let glowColor = "oklch(0.72 0.19 155 / 0.25)";

  if (numPercent < 60) {
    color = "text-destructive";
    barColor = "bg-destructive";
    glowColor = "oklch(0.64 0.21 25 / 0.25)";
  } else if (numPercent < 85) {
    color = "text-warning-amber";
    barColor = "bg-warning-amber";
    glowColor = "oklch(0.80 0.14 75 / 0.25)";
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Confidence
        </span>
        <motion.span
          className={`text-3xl font-bold font-mono tracking-tight ${color}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {percent}%
        </motion.span>
      </div>

      <div className="relative h-3 bg-muted/60 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(numPercent, 100)}%` }}
          transition={{
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2,
          }}
          style={{
            boxShadow: `0 0 12px ${glowColor}`,
          }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-muted-foreground/60 font-medium">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
    </div>
  );
}
