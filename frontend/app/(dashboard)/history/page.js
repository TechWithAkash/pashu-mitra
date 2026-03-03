"use client";

import { useEffect } from "react";
import { usePredictions } from "@/hooks/use-predictions";
import PredictionsTable from "@/components/history/predictions-table";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function HistoryPage() {
  const { t } = useLanguage();
  const { predictions, isLoading, hasMore, fetchPredictions, deletePrediction } =
    usePredictions();

  useEffect(() => {
    fetchPredictions(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="max-w-5xl space-y-8"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("history.title")}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("history.subtitle")}
        </p>
      </div>

      {isLoading && predictions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-24"
        >
          <Loader2 className="h-7 w-7 animate-spin text-primary/60" />
          <p className="text-sm text-muted-foreground mt-4">{t("history.loading")}</p>
        </motion.div>
      ) : (
        <PredictionsTable
          predictions={predictions}
          onDelete={deletePrediction}
          onLoadMore={() => fetchPredictions(false)}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      )}
    </motion.div>
  );
}
