"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, Bug, Thermometer, Globe } from "lucide-react";

const facts = [
  {
    icon: Bug,
    title: "What is LSD?",
    text: "Lumpy Skin Disease is a viral infection caused by the Lumpy Skin Disease Virus (LSDV), affecting cattle worldwide. It causes nodular skin lesions, fever, and reduced milk production.",
    accent: "border-l-emerald-500",
  },
  {
    icon: AlertTriangle,
    title: "Why Early Detection?",
    text: "Early detection is critical. LSD spreads rapidly through insect vectors. Identifying infected animals early allows for isolation, reducing herd-wide outbreaks and economic losses.",
    accent: "border-l-amber-500",
  },
  {
    icon: Thermometer,
    title: "Symptoms",
    text: "Key symptoms include firm, round skin nodules (2-5 cm), fever, swollen lymph nodes, reduced appetite, and drop in milk yield. Skin lesions are the most visible diagnostic marker.",
    accent: "border-l-rose-500",
  },
  {
    icon: Globe,
    title: "Global Impact",
    text: "LSD has spread across Africa, the Middle East, Europe, and Asia, causing billions in economic losses. It is an OIE-listed disease requiring immediate notification.",
    accent: "border-l-blue-500",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function AboutLsdSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-32 bg-background relative">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.13 0.02 260) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            About the Disease
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-balance">
            Understanding{" "}
            <span className="gradient-text">Lumpy Skin Disease</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed text-balance">
            Knowledge is the first line of defense against livestock disease.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 gap-6"
        >
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <motion.div
                key={fact.title}
                variants={cardVariants}
                className={`group bg-card rounded-2xl p-7 shadow-premium border border-border/50 border-l-4 ${fact.accent} hover:shadow-elevated transition-all duration-500`}
              >
                <div className="flex gap-5">
                  <div className="shrink-0 mt-0.5">
                    <div className="p-2.5 rounded-xl bg-muted/50">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight mb-2.5">
                      {fact.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {fact.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
