"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/language-context";

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

const testimonials = [
  { quoteKey: "testimonials.quote1", nameKey: "testimonials.name1", roleKey: "testimonials.role1", initial: "R", gradient: "from-emerald-400 to-teal-500" },
  { quoteKey: "testimonials.quote2", nameKey: "testimonials.name2", roleKey: "testimonials.role2", initial: "S", gradient: "from-amber-400 to-orange-500" },
  { quoteKey: "testimonials.quote3", nameKey: "testimonials.name3", roleKey: "testimonials.role3", initial: "P", gradient: "from-blue-400 to-indigo-500" },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" className="py-32 bg-muted/30 relative">
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            {t("testimonials.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-balance">
            {t("testimonials.heading")}{" "}
            <span className="gradient-text">{t("testimonials.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed text-balance">
            {t("testimonials.subtext")}
          </p>
        </motion.div>

        {/* Testimonial cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.nameKey}
              variants={cardVariants}
              className="group relative bg-card rounded-2xl p-7 shadow-premium border border-border/50 hover:shadow-elevated transition-all duration-500"
            >
              <div className="text-5xl font-serif text-primary/10 leading-none mb-2">&ldquo;</div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {t(testimonial.quoteKey)}
              </p>
              <div className="h-px bg-border/50 mb-4" />
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-sm font-semibold text-white`}>
                  {testimonial.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t(testimonial.nameKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(testimonial.roleKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
