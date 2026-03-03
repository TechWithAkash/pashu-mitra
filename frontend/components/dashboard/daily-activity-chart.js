"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { getDailyActivityData } from "@/lib/dashboard-utils";
import { CalendarDays } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HEALTHY_GREEN = "#34d399";
const DISEASED_RED = "#ef4444";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-xl shadow-elevated px-3 py-2.5 text-xs">
      <p className="font-semibold text-foreground mb-1">{d?.dateLabel || label}</p>
      <div className="space-y-0.5">
        <p className="text-healthy">
          Healthy: <span className="font-mono font-bold">{d?.healthy || 0}</span>
        </p>
        <p className="text-destructive">
          Attention: <span className="font-mono font-bold">{d?.diseased || 0}</span>
        </p>
      </div>
    </div>
  );
}

export default function DailyActivityChart({ predictions }) {
  const { t } = useLanguage();
  const [range, setRange] = useState(7);

  const data = useMemo(
    () => getDailyActivityData(predictions, range),
    [predictions, range]
  );

  const hasActivity = data.some((d) => d.healthy > 0 || d.diseased > 0);

  return (
    <Card className="shadow-premium">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[15px] font-semibold">
              {t("dashboard.dailyActivity")}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("dashboard.dailyActivityDesc")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRange(7)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                range === 7
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("dashboard.last7Days")}
            </button>
            <button
              onClick={() => setRange(14)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                range === 14
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("dashboard.last14Days")}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {!hasActivity ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-[12px] text-muted-foreground">
              {t("dashboard.noActivityYet")}
            </p>
          </div>
        ) : (
          <div className="h-[200px] sm:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
                <Bar
                  dataKey="healthy"
                  stackId="a"
                  fill={HEALTHY_GREEN}
                  radius={[0, 0, 0, 0]}
                  animationDuration={800}
                />
                <Bar
                  dataKey="diseased"
                  stackId="a"
                  fill={DISEASED_RED}
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
