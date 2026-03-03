"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { getConfidenceBuckets } from "@/lib/dashboard-utils";
import { Gauge } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Amber → green gradient for increasing confidence
const BUCKET_COLORS = ["#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-xl shadow-elevated px-3 py-2 text-xs">
      <p className="font-semibold text-foreground">{d.range}</p>
      <p className="text-muted-foreground">
        {d.count} check-up{d.count !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function ConfidenceChart({ predictions }) {
  const { t } = useLanguage();

  const data = useMemo(() => getConfidenceBuckets(predictions), [predictions]);
  const hasData = data.some((d) => d.count > 0);

  return (
    <Card className="shadow-premium">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[15px] font-semibold">
              {t("dashboard.confidenceChart")}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("dashboard.confidenceChartDesc")}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-primary/10">
            <Gauge className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Gauge className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-[12px] text-muted-foreground">
              {t("dashboard.notEnoughData")}
            </p>
          </div>
        ) : (
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={800}>
                  {data.map((entry, index) => (
                    <Cell key={entry.range} fill={BUCKET_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
