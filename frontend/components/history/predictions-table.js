"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Trash2, Loader2, ClipboardList, AlertTriangle, Lightbulb } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const row = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function PredictionsTable({
  predictions,
  onDelete,
  onLoadMore,
  hasMore,
  isLoading,
}) {
  const { t } = useLanguage();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailPrediction, setDetailPrediction] = useState(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      toast.success(t("history.deleted"));
    } catch {
      toast.error(t("history.deleteFailed"));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (predictions.length === 0 && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center justify-center py-24 px-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6">
          <ClipboardList className="h-7 w-7 text-primary/40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{t("history.noResults")}</h3>
        <p className="text-sm text-muted-foreground max-w-sm text-center text-balance leading-relaxed">
          {t("history.noResultsHint")}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-xl border border-border/60 bg-card shadow-premium overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/60">
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 py-3.5">
                {t("history.date")}
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 py-3.5">
                {t("history.file")}
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 py-3.5">
                {t("history.result")}
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 py-3.5 text-right">
                {t("history.confidence")}
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 py-3.5 text-right">
                {t("history.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
          >
            {predictions.map((p) => {
              const isLSD = p.prediction_result?.toLowerCase().includes("lumpy");
              return (
                <motion.tr
                  key={p.id}
                  variants={row}
                  className="group border-b border-border/40 hover:bg-muted/30 transition-colors duration-200"
                >
                  <TableCell className="text-sm text-muted-foreground py-4">
                    {new Date(p.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm font-medium py-4">
                    {p.image_filename}
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isLSD
                          ? "bg-destructive/10 text-destructive"
                          : "bg-healthy/10 text-healthy"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLSD ? "bg-destructive" : "bg-healthy"
                        }`}
                      />
                      {isLSD ? t("dashboard.needsAttention") : t("dashboard.healthy")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <span className="font-mono text-sm tabular-nums text-muted-foreground">
                      {(p.confidence * 100).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        onClick={() => setDetailPrediction(p)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </Table>
      </motion.div>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center pt-2"
        >
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-xl px-6 border-border/60 hover:bg-muted/50 hover:border-border transition-all duration-200"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {t("history.loadMore")}
          </Button>
        </motion.div>
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md shadow-elevated border-border/60">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-center">{t("history.deleteTitle")}</DialogTitle>
            <DialogDescription className="text-center">
              {t("history.deleteDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="rounded-xl flex-1 sm:flex-none sm:min-w-[100px]"
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl flex-1 sm:flex-none sm:min-w-[100px]"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog
        open={!!detailPrediction}
        onOpenChange={() => setDetailPrediction(null)}
      >
        <DialogContent className="sm:max-w-lg shadow-elevated border-border/60">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{t("history.detailTitle")}</DialogTitle>
          </DialogHeader>
          {detailPrediction && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">{t("history.file")}</p>
                  <p className="font-medium text-sm truncate">{detailPrediction.image_filename}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">{t("history.date")}</p>
                  <p className="font-medium text-sm">
                    {new Date(detailPrediction.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">{t("history.result")}</p>
                  <p className="font-medium text-sm">{detailPrediction.prediction_result}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">{t("history.confidence")}</p>
                  <p className="font-mono font-semibold text-sm tabular-nums">
                    {(detailPrediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {detailPrediction.quality_warning && (
                <div className="flex items-start gap-3 text-sm p-3.5 bg-warning-amber/5 rounded-xl border border-warning-amber/20">
                  <AlertTriangle className="h-4 w-4 text-warning-amber mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-warning-amber mb-0.5">{t("result.qualityWarning")}</p>
                    <p className="text-muted-foreground leading-relaxed">{detailPrediction.quality_warning}</p>
                  </div>
                </div>
              )}

              {detailPrediction.advice && (
                <div className="flex items-start gap-3 text-sm p-3.5 bg-primary/5 rounded-xl border border-primary/15">
                  <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-primary mb-0.5">{t("history.advice")}</p>
                    <p className="text-muted-foreground leading-relaxed">{detailPrediction.advice}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
