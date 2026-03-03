"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { getDistributionData } from "@/lib/dashboard-utils";
import { PieChart as PieIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#34d399", "#ef4444"];

export default function PredictionDistribution({ predictions }) {
  const { t } = useLanguage();

  const data = useMemo(() => getDistributionData(predictions), [predictions]);
  const total = predictions.length;
  const healthyPct = total > 0 ? Math.round((data[0].value / total) * 100) : 100;

  // Filter out zero-value segments so recharts renders correctly
  const chartData = data.filter((d) => d.value > 0);

  return (
    <Card className="shadow-premium h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[15px] font-semibold">
              {t("dashboard.distribution")}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("dashboard.distributionDesc")}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-primary/10">
            <PieIcon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <PieIcon className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-[12px] text-muted-foreground">
              {t("dashboard.notEnoughData")}
            </p>
          </div>
        ) : (
          <>
            <div className="h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={chartData.length > 1 ? 4 : 0}
                    dataKey="value"
                    strokeWidth={0}
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={entry.name === "Healthy" ? COLORS[0] : COLORS[1]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold font-mono tracking-tight">
                  {healthyPct}%
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {t("dashboard.healthyLabel")}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-healthy" />
                <span className="text-[11px] text-muted-foreground">
                  {t("dashboard.healthyLabel")} ({data[0].value})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                <span className="text-[11px] text-muted-foreground">
                  {t("dashboard.diseasedLabel")} ({data[1].value})
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
