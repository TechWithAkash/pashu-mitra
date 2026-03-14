"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, AlertTriangle, Activity } from "lucide-react";

export default function ProductPreviewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-primary/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wide mb-6">
            App Preview
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Clear Results, <span className="text-primary">Actionable Advice</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            See exactly how Pashumitra helps you understand your cattle's health in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Main App Mockup */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">

            {/* Left Image Area */}
            <div className="w-full md:w-5/12 bg-gray-100 relative min-h-[300px]">
              <div className="absolute inset-0 bg-[url('/images/healthy-cattle-hero.png')] bg-cover bg-center opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <span className="text-sm font-semibold text-gray-800">Scan Area</span>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">Clear</span>
                </div>
              </div>
            </div>

            {/* Right Dashboard Area */}
            <div className="w-full md:w-7/12 p-8 sm:p-10 flex flex-col justify-center">

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h3>
                <p className="text-sm text-gray-500">Processed in 1.4 seconds</p>
              </div>

              {/* Highlight Cards */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Disease Risk Score</h4>
                    <p className="text-lg font-bold text-gray-900">Very Low Risk</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">AI Confidence</h4>
                    <p className="text-lg font-bold text-gray-900">99.8% Accuracy</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">Suggested Precautions</h4>
                    <ul className="text-sm text-amber-900 font-medium space-y-1 list-disc list-inside">
                      <li>Maintain current feeding routine.</li>
                      <li>Schedule next check-up in 30 days.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
