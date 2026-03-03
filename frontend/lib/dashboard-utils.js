/**
 * Dashboard data-processing utilities.
 * Pure functions — no React, no "use client".
 */

export function isLSD(prediction) {
  return prediction.prediction_result?.toLowerCase().includes("lumpy");
}

export function formatDateShort(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Group predictions by calendar day (YYYY-MM-DD).
 * Returns a Map sorted by date ascending.
 */
export function groupPredictionsByDay(predictions) {
  const map = new Map();
  for (const p of predictions) {
    const day = p.created_at?.slice(0, 10);
    if (!day) continue;
    if (!map.has(day)) map.set(day, []);
    map.get(day).push(p);
  }
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

/**
 * Health score per day for the last N days.
 * Days with no checks get `healthScore: null` (chart will show a gap).
 */
export function getHealthTrendData(predictions, days = 14) {
  const grouped = groupPredictionsByDay(predictions);
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayPreds = grouped.get(key) || [];

    const total = dayPreds.length;
    const diseased = dayPreds.filter(isLSD).length;
    const healthy = total - diseased;

    result.push({
      date: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      healthScore: total > 0 ? Math.round((healthy / total) * 100) : null,
      totalChecks: total,
    });
  }
  return result;
}

/**
 * Daily activity (healthy + diseased counts) for the last N days.
 */
export function getDailyActivityData(predictions, days = 7) {
  const grouped = groupPredictionsByDay(predictions);
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayPreds = grouped.get(key) || [];

    const diseased = dayPreds.filter(isLSD).length;
    const healthy = dayPreds.length - diseased;

    result.push({
      date: d.toLocaleDateString("en-US", { weekday: "short" }),
      dateLabel: d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
      healthy,
      diseased,
    });
  }
  return result;
}

/**
 * Overall distribution: healthy vs diseased.
 */
export function getDistributionData(predictions) {
  const diseased = predictions.filter(isLSD).length;
  const healthy = predictions.length - diseased;
  return [
    { name: "Healthy", value: healthy },
    { name: "Needs Attention", value: diseased },
  ];
}

/**
 * Confidence histogram in 5 buckets.
 */
export function getConfidenceBuckets(predictions) {
  const buckets = [
    { range: "<60%", min: 0, max: 0.6, count: 0 },
    { range: "60-70%", min: 0.6, max: 0.7, count: 0 },
    { range: "70-80%", min: 0.7, max: 0.8, count: 0 },
    { range: "80-90%", min: 0.8, max: 0.9, count: 0 },
    { range: "90-100%", min: 0.9, max: 1.01, count: 0 },
  ];
  for (const p of predictions) {
    const conf = p.confidence ?? 0;
    const bucket = buckets.find((b) => conf >= b.min && conf < b.max);
    if (bucket) bucket.count++;
  }
  return buckets.map(({ range, count }) => ({ range, count }));
}

/**
 * Compare last 7 days vs previous 7 days to determine trend.
 * Returns "improving" | "declining" | "stable".
 */
export function getTrendDirection(predictions) {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const recent = predictions.filter(
    (p) => new Date(p.created_at) >= sevenDaysAgo
  );
  const previous = predictions.filter(
    (p) =>
      new Date(p.created_at) >= fourteenDaysAgo &&
      new Date(p.created_at) < sevenDaysAgo
  );

  const recentRate =
    recent.length > 0
      ? (recent.length - recent.filter(isLSD).length) / recent.length
      : null;
  const prevRate =
    previous.length > 0
      ? (previous.length - previous.filter(isLSD).length) / previous.length
      : null;

  if (recentRate === null || prevRate === null) return "stable";
  if (recentRate > prevRate + 0.05) return "improving";
  if (recentRate < prevRate - 0.05) return "declining";
  return "stable";
}
