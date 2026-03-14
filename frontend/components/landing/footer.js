"use client";

import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import LanguageToggle from "@/components/ui/language-toggle";

export default function Footer() {
  const { t } = useLanguage();

  const productLinks = [
    { href: "#features", labelKey: "features.badge" },
    { href: "#how-it-works", labelKey: "howItWorks.badge" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faq", label: "FAQ" },
  ];

  const supportLinks = [
    { href: "#about", labelKey: "about.badge" },
    { href: "#", labelKey: "footer.help" },
    { href: "#", labelKey: "footer.contact" },
  ];

  const legalLinks = [
    { href: "#", labelKey: "footer.privacy" },
    { href: "#", labelKey: "footer.terms" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-border/50 bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Multi-column layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-primary rounded-xl">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold tracking-tight text-primary text-lg">
                Pashumitra
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-[240px]">
              {t("footer.description")}
            </p>
            <LanguageToggle />
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              {t("footer.product")}
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href + (link.labelKey || link.label)}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.labelKey ? t(link.labelKey) : link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              {t("footer.support")}
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.labelKey}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.labelKey}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
