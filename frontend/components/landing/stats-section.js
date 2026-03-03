"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import { Target, Timer, Clock, Layers } from "lucide-react";
import { useLanguage } from "@/context/language-context";

function AnimatedCounter({ value, prefix = "", suffix = "", isInView }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [isInView, value, count]);

  return (
    <motion.span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}

export default function StatsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { value: 92, suffix: "%+", labelKey: "stats.accuracy", icon: Target },
    { value: 2, prefix: "<", suffix: "s", labelKey: "stats.analysisTime", icon: Timer },
    { value: 24, suffix: "/7", labelKey: "stats.availability", icon: Clock },
    { value: 2, suffix: "", labelKey: "stats.classes", icon: Layers },
  ];

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.22_0.06_155)] via-[oklch(0.18_0.05_165)] to-[oklch(0.14_0.04_180)]" />

      {/* Subtle grid dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gradient mesh accents */}
      <div
        className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.16 155 / 0.3), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, oklch(0.58 0.13 200 / 0.3), transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`text-center ${
                  i < stats.length - 1 ? "lg:border-r lg:border-white/10" : ""
                }`}
              >
                {/* Icon above stat */}
                <div className="flex justify-center mb-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08]">
                    <Icon className="h-5 w-5 text-emerald-400/70" />
                  </div>
                </div>
                <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-mono text-white tracking-tight mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    isInView={isInView}
                  />
                </p>
                <p className="text-sm font-medium text-white/40 uppercase tracking-wider">
                  {t(stat.labelKey)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
