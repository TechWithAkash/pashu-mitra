"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { getHealthTrendData } from "@/lib/dashboard-utils";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HEALTHY_GREEN = "#34d399";
const HEALTHY_GREEN_LIGHT = "#34d39933";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-xl shadow-elevated px-3 py-2.5 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {data.healthScore !== null ? (
        <>
          <p className="text-healthy">
            Health Score:{" "}
            <span className="font-mono font-bold">{data.healthScore}%</span>
          </p>
          <p className="text-muted-foreground mt-0.5">
            {data.totalChecks} check-up{data.totalChecks !== 1 ? "s" : ""}
          </p>
        </>
      ) : (
        <p className="text-muted-foreground">No check-ups</p>
      )}
    </div>
  );
}

export default function HealthTrendChart({ predictions }) {
  const { t } = useLanguage();

  const data = useMemo(() => getHealthTrendData(predictions, 14), [predictions]);

  const hasData = data.some((d) => d.healthScore !== null);

  return (
    <Card className="shadow-premium">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[15px] font-semibold">
              {t("dashboard.healthTrend")}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("dashboard.healthTrendDesc")}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-[12px] text-muted-foreground">
              {t("dashboard.notEnoughData")}
            </p>
          </div>
        ) : (
          <div className="h-[200px] sm:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={HEALTHY_GREEN} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={HEALTHY_GREEN} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--color-border)"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="healthScore"
                  stroke={HEALTHY_GREEN}
                  strokeWidth={2.5}
                  fill="url(#healthGradient)"
                  connectNulls={false}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, fill: "white", stroke: HEALTHY_GREEN }}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
