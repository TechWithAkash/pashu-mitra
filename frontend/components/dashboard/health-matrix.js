"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { isLSD, formatDateShort } from "@/lib/dashboard-utils";
import { Grid3x3 } from "lucide-react";
import { motion } from "framer-motion";

const cellVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.03,
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  }),
};

export default function HealthMatrix({ predictions }) {
  const { t } = useLanguage();

  // Take last 20 predictions, most recent first
  const cells = useMemo(() => {
    const sorted = [...predictions]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 20);
    return sorted.map((p) => ({
      id: p.id,
      healthy: !isLSD(p),
      filename: p.image_filename,
      date: formatDateShort(p.created_at),
      confidence: (p.confidence * 100).toFixed(0),
    }));
  }, [predictions]);

  // Pad to 20 cells for consistent grid
  const paddedCells = useMemo(() => {
    const pad = [];
    for (let i = cells.length; i < 20; i++) {
      pad.push({ id: `empty-${i}`, empty: true });
    }
    return [...cells, ...pad];
  }, [cells]);

  return (
    <Card className="shadow-premium h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[15px] font-semibold">
              {t("dashboard.healthMatrix")}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("dashboard.healthMatrixDesc")}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-primary/10">
            <Grid3x3 className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Grid3x3 className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-[12px] text-muted-foreground">
              {t("dashboard.notEnoughData")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2 py-2">
            {paddedCells.map((cell, i) => (
              <motion.div
                key={cell.id}
                custom={i}
                variants={cellVariants}
                initial="hidden"
                animate="visible"
                className="relative group"
              >
                <div
                  className={`aspect-square rounded-lg transition-transform duration-150 group-hover:scale-110 ${
                    cell.empty
                      ? "bg-muted/40"
                      : cell.healthy
                      ? "bg-healthy/80"
                      : "bg-destructive/80"
                  }`}
                />
                {!cell.empty && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-background/95 backdrop-blur-sm border rounded-lg shadow-elevated text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-10">
                    <p className="font-medium truncate max-w-[120px]">
                      {cell.filename}
                    </p>
                    <p className="text-muted-foreground">
                      {cell.date} &middot; {cell.confidence}%
                    </p>
                    <p
                      className={
                        cell.healthy ? "text-healthy font-medium" : "text-destructive font-medium"
                      }
                    >
                      {cell.healthy
                        ? t("dashboard.healthyLabel")
                        : t("dashboard.diseasedLabel")}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Mini-legend */}
        {predictions.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-healthy/80" />
              <span className="text-[10px] text-muted-foreground">
                {t("dashboard.healthyLabel")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-destructive/80" />
              <span className="text-[10px] text-muted-foreground">
                {t("dashboard.diseasedLabel")}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
