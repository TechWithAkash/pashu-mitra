"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import {
  BrainCircuit,
  Ruler,
  Tags,
  Target,
  Activity,
  Shield,
  HardDrive,
  Calendar,
  Loader2,
  ServerCrash,
} from "lucide-react";
import { motion } from "framer-motion";

const metricItems = [
  { key: "architecture", label: "Architecture", icon: BrainCircuit },
  { key: "img_size", label: "Input Size", icon: Ruler, format: (v) => `${v}x${v}px` },
  { key: "class_names", label: "Classes", icon: Tags, format: (v) => v?.join(", ") },
  { key: "accuracy", label: "Accuracy", icon: Target, format: (v) => v ? `${(v * 100).toFixed(2)}%` : "N/A" },
  { key: "sensitivity", label: "Sensitivity", icon: Activity, format: (v) => v ? `${(v * 100).toFixed(2)}%` : "N/A" },
  { key: "specificity", label: "Specificity", icon: Shield, format: (v) => v ? `${(v * 100).toFixed(2)}%` : "N/A" },
  { key: "model_size_mb", label: "Model Size", icon: HardDrive, format: (v) => v ? `${v.toFixed(1)} MB` : "N/A" },
  { key: "training_date", label: "Training Date", icon: Calendar },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function ModelInfoPage() {
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient.get("/model/info");
        setInfo(data);
      } catch (err) {
        setError(err.message || "Failed to load model info");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24"
      >
        <Loader2 className="h-7 w-7 animate-spin text-primary/60" />
        <p className="text-sm text-muted-foreground mt-4">Loading model information...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-3xl space-y-8"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Model Information
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Details about the currently loaded detection model
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center mb-6">
            <ServerCrash className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No model available</h3>
          <p className="text-sm text-muted-foreground max-w-sm text-center text-balance leading-relaxed">
            No model information is available at the moment. Train a model first to see its details here.
          </p>
        </div>
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
          Model Information
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Details about the currently loaded detection model
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {metricItems.map((metric) => {
          const Icon = metric.icon;
          const rawValue = info?.[metric.key];
          const displayValue = metric.format
            ? metric.format(rawValue)
            : rawValue || "N/A";

          return (
            <motion.div
              key={metric.key}
              variants={item}
              className="group rounded-xl border border-border/60 bg-card shadow-premium p-4 hover:shadow-elevated transition-shadow duration-300"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/8 transition-colors duration-300">
                  <Icon className="h-[18px] w-[18px] text-primary/70" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-1">
                    {metric.label}
                  </p>
                  <p className="font-semibold text-sm text-foreground truncate">
                    {displayValue}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
