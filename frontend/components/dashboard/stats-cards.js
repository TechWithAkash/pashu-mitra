"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScanLine, ShieldAlert, HeartPulse, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { isLSD, getTrendDirection } from "@/lib/dashboard-utils";

const statsConfig = [
  {
    key: "total",
    labelKey: "dashboard.animalsChecked",
    icon: ScanLine,
    color: "text-primary",
    iconBg: "bg-primary/10",
    borderColor: "border-l-primary",
  },
  {
    key: "lsd",
    labelKey: "dashboard.needAttention",
    icon: ShieldAlert,
    color: "text-destructive",
    iconBg: "bg-destructive/10",
    borderColor: "border-l-destructive",
  },
  {
    key: "healthy",
    labelKey: "dashboard.healthyAnimals",
    icon: HeartPulse,
    color: "text-healthy",
    iconBg: "bg-healthy/10",
    borderColor: "border-l-healthy",
  },
  {
    key: "rate",
    labelKey: "dashboard.healthScore",
    icon: Activity,
    color: "text-primary",
    iconBg: "bg-primary/5",
    borderColor: "border-l-primary/60",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const TREND_ICON = {
  improving: TrendingUp,
  declining: TrendingDown,
  stable: Minus,
};
const TREND_COLOR = {
  improving: "text-healthy",
  declining: "text-destructive",
  stable: "text-muted-foreground",
};

export default function StatsCards({ predictions }) {
  const { t } = useLanguage();
  const total = predictions.length;
  const lsdCount = predictions.filter(isLSD).length;
  const healthyCount = total - lsdCount;
  const rate = total > 0 ? (((total - lsdCount) / total) * 100).toFixed(1) : "100.0";

  const trend = useMemo(() => getTrendDirection(predictions), [predictions]);
  const TrendIcon = TREND_ICON[trend];
  const trendKey = `dashboard.${trend}`;

  const values = {
    total,
    lsd: lsdCount,
    healthy: healthyCount,
    rate: `${rate}%`,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div key={stat.key} variants={cardVariants}>
            <Card
              className={`shadow-premium border-l-[3px] ${stat.borderColor} hover:shadow-elevated transition-shadow duration-300`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                      {t(stat.labelKey)}
                    </p>
                    <p className="text-2xl font-bold font-mono tracking-tight">
                      {values[stat.key]}
                    </p>
                    {/* Trend indicator on the health score card */}
                    {stat.key === "rate" && total > 0 && (
                      <div className={`flex items-center gap-1 ${TREND_COLOR[trend]}`}>
                        <TrendIcon className="h-3 w-3" />
                        <span className="text-[10px] font-medium">
                          {t(trendKey)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
