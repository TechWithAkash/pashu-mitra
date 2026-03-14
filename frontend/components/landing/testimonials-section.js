"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/language-context";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const testimonials = [
  { quoteKey: "testimonials.quote1", nameKey: "testimonials.name1", roleKey: "testimonials.role1", initial: "R", color: "bg-blue-600" },
  { quoteKey: "testimonials.quote2", nameKey: "testimonials.name2", roleKey: "testimonials.role2", initial: "S", color: "bg-primary" },
  { quoteKey: "testimonials.quote3", nameKey: "testimonials.name3", roleKey: "testimonials.role3", initial: "P", color: "bg-amber-500" },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wide mb-6">
            {t("testimonials.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            {t("testimonials.heading")}{" "}
            <span className="text-primary">{t("testimonials.headingHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            {t("testimonials.subtext")}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.nameKey}
              variants={cardVariants}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-8 hover:shadow-md transition-shadow relative"
            >
              <div className="text-5xl font-serif text-primary/20 leading-none mb-1">&ldquo;</div>
              <p className="text-gray-700 leading-relaxed mb-8 relative z-10 italic">
                "{t(testimonial.quoteKey)}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className={`h-12 w-12 rounded-full ${testimonial.color} flex items-center justify-center text-lg font-bold text-white shadow-sm`}>
                  {testimonial.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t(testimonial.nameKey)}</p>
                  <p className="text-xs font-medium text-gray-500">{t(testimonial.roleKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
