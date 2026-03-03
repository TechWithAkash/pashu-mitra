"use client";

import { useState } from "react";
import { useTrainingStatus } from "@/hooks/use-training-status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  AlertTriangle,
  Zap,
  Timer,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const statusConfig = {
  idle: {
    label: "Idle",
    icon: Clock,
    color: "bg-muted/60 text-muted-foreground",
    dot: "bg-muted-foreground/50",
  },
  training: {
    label: "Training",
    icon: Activity,
    color: "bg-primary/10 text-primary",
    dot: "bg-primary animate-pulse",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "bg-healthy/10 text-healthy",
    dot: "bg-healthy",
  },
  error: {
    label: "Error",
    icon: XCircle,
    color: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function TrainingPage() {
  const { status, isLoading, startTraining } = useTrainingStatus();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await startTraining();
      toast.success("Training started");
    } catch (err) {
      toast.error(err.message || "Failed to start training");
    } finally {
      setIsStarting(false);
    }
  };

  const currentStatus = status?.status || "idle";
  const config = statusConfig[currentStatus] || statusConfig.idle;
  const StatusIcon = config.icon;
  const isTraining = currentStatus === "training";

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24"
      >
        <Loader2 className="h-7 w-7 animate-spin text-primary/60" />
        <p className="text-sm text-muted-foreground mt-4">Loading training status...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="max-w-3xl space-y-8"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Model Training
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Train or retrain the LSD detection model
        </p>
      </div>

      {/* Status + Controls card */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-xl border border-border/60 bg-card shadow-premium overflow-hidden"
      >
        {/* Header with status badge */}
        <div className="p-6 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Training Status</h3>
              <p className="text-xs text-muted-foreground">
                {isTraining ? "Model is currently training" : "Ready to train"}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Training progress */}
          {isTraining && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 p-4 rounded-xl bg-primary/[0.02] border border-primary/10"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Progress</span>
                {status?.elapsed_seconds && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                    <Timer className="h-3 w-3" />
                    {Math.round(status.elapsed_seconds)}s elapsed
                  </span>
                )}
              </div>
              <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
                  initial={{ width: "5%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 60, ease: "linear" }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {status?.progress || "Training in progress..."}
              </p>
            </motion.div>
          )}

          {/* Error state */}
          {currentStatus === "error" && status?.error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/15"
            >
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm text-destructive mb-0.5">Training Error</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{status.error}</p>
              </div>
            </motion.div>
          )}

          {/* Completed metrics */}
          {currentStatus === "completed" && status?.metrics && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/70" />
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  Training Metrics
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(status.metrics).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.15 }}
                    className="p-3.5 rounded-xl bg-muted/30 border border-border/40"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-1">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-lg font-semibold font-mono tabular-nums text-foreground">
                      {typeof value === "number" ? value.toFixed(4) : value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action button */}
          <div className="pt-1">
            <Button
              onClick={handleStart}
              disabled={isStarting || isTraining}
              className="rounded-xl px-6 h-10"
              size="default"
            >
              {isStarting || isTraining ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isTraining ? "Training in Progress..." : "Start Training"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
