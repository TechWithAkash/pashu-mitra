"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import LanguageToggle from "@/components/ui/language-toggle";

const navLinks = [
  { href: "#features", labelKey: "features.badge" },
  { href: "#how-it-works", labelKey: "howItWorks.badge" },
  { href: "#about", labelKey: "about.badge" },
];

export default function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-b border-white/10 shadow-premium"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              scrolled
                ? "bg-primary shadow-sm"
                : "bg-primary shadow-sm"
            )}
          >
            <Shield
              className={cn(
                "h-5 w-5 transition-colors duration-300 relative z-10",
                scrolled ? "text-primary-foreground" : "text-primary-foreground"
              )}
            />
          </div>
          <span
            className={cn(
              "text-xl font-bold tracking-tight transition-colors duration-300",
              scrolled ? "text-primary" : "text-primary"
            )}
          >
            Pashumitra
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 relative",
                  scrolled
                    ? "text-gray-600 hover:text-primary"
                    : "text-gray-700 hover:text-primary",
                  "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                )}
              >
                {t(link.labelKey)}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "text-sm font-medium transition-all duration-300",
                scrolled
                  ? "text-gray-600 hover:text-primary"
                  : "text-gray-700 hover:text-primary bg-white/50"
              )}
            >
              <Link href="/login">{t("common.signIn")}</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className={cn(
                "text-sm font-medium rounded-full px-5 transition-all duration-300",
                scrolled
                  ? "bg-primary text-primary-foreground hover:shadow-md"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
              )}
            >
              <Link href="/signup">{t("common.createAccount")}</Link>
            </Button>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "md:hidden p-2 rounded-lg transition-colors",
            scrolled
              ? "text-foreground hover:bg-muted"
              : "text-foreground hover:bg-white"
          )}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden glass border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="block text-sm font-medium text-foreground/80 hover:text-foreground py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.labelKey)}
                </motion.a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50 mt-2">
                <div className="px-3 py-2">
                  <LanguageToggle />
                </div>
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/login">{t("common.signIn")}</Link>
                </Button>
                <Button asChild className="rounded-full shadow-glow">
                  <Link href="/signup">{t("common.createAccount")}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
