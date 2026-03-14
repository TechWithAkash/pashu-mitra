"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/language-context";

export default function CtaSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6 sm:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground shadow-2xl"
        >
          {/* Subtle nature wave/decoration */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />

          {/* Content */}
          <div className="relative p-12 sm:p-16 lg:p-20 text-center flex flex-col items-center">

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
              {t("cta.heading")} <br />
              <span className="text-green-300">{t("cta.headingHighlight")}</span>
            </h2>

            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed mb-10">
              {t("cta.subtext")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Button
                size="lg"
                asChild
                className="bg-white text-primary hover:bg-gray-50 text-base font-bold px-10 h-14 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/signup">
                  {t("cta.createAccount")}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-2 border-primary-foreground text-white hover:bg-white/10 text-base font-medium px-8 h-14 rounded-full transition-all"
              >
                <Link href="/login">{t("cta.signIn")}</Link>
              </Button>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
