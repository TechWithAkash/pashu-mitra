"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import LanguageToggle from "@/components/ui/language-toggle";

const navLinks = [
  { href: "#features", labelKey: "features.badge" },
  { href: "#how-it-works", labelKey: "howItWorks.badge" },
  { href: "#about", labelKey: "about.badge" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-border/50 bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary rounded-xl">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight gradient-text text-lg">
              Pashumitra
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </div>

          {/* Language Toggle */}
          <LanguageToggle />
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <p className="text-xs text-muted-foreground/40">
            {t("footer.builtWith")}
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
