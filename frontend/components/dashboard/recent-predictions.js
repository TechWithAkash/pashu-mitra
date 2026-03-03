"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ScanLine, FileImage } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function RecentPredictions({ predictions }) {
  const { t } = useLanguage();
  const recent = predictions.slice(0, 5);

  if (recent.length === 0) {
    return (
      <Card className="shadow-premium">
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold">
            {t("dashboard.recentResults")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center py-8 space-y-4">
            <div className="p-4 rounded-2xl bg-muted/50">
              <FileImage className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <div className="space-y-1.5">
              <p className="text-[13px] font-medium text-foreground">
                {t("dashboard.noResults")}
              </p>
              <p className="text-[12px] text-muted-foreground max-w-[240px]">
                {t("dashboard.noResultsHint")}
              </p>
            </div>
            <Button asChild size="sm" className="mt-2 rounded-lg">
              <Link href="/predict">
                <ScanLine className="h-3.5 w-3.5 mr-1.5" />
                {t("dashboard.startFirst")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-premium">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-[15px] font-semibold">
          {t("dashboard.recentResults")}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-[12px] text-muted-foreground hover:text-foreground h-8 rounded-lg"
        >
          <Link href="/history">
            {t("dashboard.viewAll")}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_80px_90px] gap-3 px-3 pb-2.5 border-b">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {t("history.file")}
          </p>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider text-right">
            {t("history.confidence")}
          </p>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider text-right">
            {t("history.result")}
          </p>
        </div>

        {/* Table rows */}
        <div className="divide-y">
          {recent.map((p, i) => {
            const isLSD = p.prediction_result?.toLowerCase().includes("lumpy");
            return (
              <motion.div
                key={p.id}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-[1fr_80px_90px] gap-3 items-center px-3 py-3 hover:bg-muted/30 transition-colors duration-150 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate">
                    {p.image_filename}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {new Date(p.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-[13px] font-mono text-muted-foreground text-right tabular-nums">
                  {(p.confidence * 100).toFixed(1)}%
                </p>
                <div className="flex justify-end">
                  <Badge
                    variant={isLSD ? "destructive" : "default"}
                    className={
                      isLSD
                        ? "text-[11px] font-medium px-2 py-0.5 rounded-md"
                        : "text-[11px] font-medium px-2 py-0.5 rounded-md bg-healthy/10 text-healthy hover:bg-healthy/20 border-0"
                    }
                  >
                    {isLSD ? t("dashboard.needsAttention") : t("dashboard.healthy")}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
