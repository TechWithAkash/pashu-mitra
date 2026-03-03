"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useLanguage } from "@/context/language-context";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentPredictions from "@/components/dashboard/recent-predictions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScanLine, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient.get("/predictions?skip=0&limit=100");
        setPredictions(data);
      } catch {
        // Might have no predictions yet
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          </div>
          <p className="text-[13px] text-muted-foreground font-medium">
            {t("dashboard.loadingDashboard")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page header */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h2>
          <p className="text-[13px] text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-premium h-9 px-4">
          <Link href="/predict">
            <ScanLine className="h-3.5 w-3.5 mr-2" />
            <span className="text-[13px] font-medium">{t("dashboard.newScan")}</span>
          </Link>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <StatsCards predictions={predictions} />
      </motion.div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <RecentPredictions predictions={predictions} />
        </motion.div>

        <motion.div
          custom={3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-premium overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
            <CardContent className="p-6 flex flex-col items-center text-center space-y-5 relative">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[15px] font-semibold">{t("dashboard.quickScan")}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed max-w-[220px]">
                  {t("dashboard.quickScanDesc")}
                </p>
              </div>
              <Button
                asChild
                className="w-full rounded-xl h-9 text-[13px] font-medium"
              >
                <Link href="/predict">
                  {t("dashboard.startScanning")}
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
