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
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.16 155), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, oklch(0.58 0.13 200), transparent 70%)",
          }}
        />
      </div>

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.13 0.02 260) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 sm:px-8 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            {t("cta.heading")}{" "}
            <span className="gradient-text">{t("cta.headingHighlight")}</span>{t("cta.questionMark")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed text-balance">
            {t("cta.subtext")}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <Button
              size="lg"
              asChild
              className="text-base font-semibold px-8 h-13 rounded-full shadow-glow hover:shadow-[0_0_0_1px_oklch(0.55_0.16_155/0.15),0_4px_32px_oklch(0.55_0.16_155/0.15)] transition-all duration-300"
            >
              <Link href="/signup">
                {t("cta.createAccount")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="text-base font-medium px-8 h-13 rounded-full border border-border hover:bg-muted/50 transition-all duration-300"
            >
              <Link href="/login">{t("cta.signIn")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
