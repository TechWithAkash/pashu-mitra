"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { ROLES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ScanLine,
  History,
  User,
  Dumbbell,
  BrainCircuit,
  ChevronsLeft,
  ChevronsRight,
  Shield,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.home" },
  { href: "/predict", icon: ScanLine, labelKey: "nav.checkAnimal" },
  { href: "/history", icon: History, labelKey: "nav.pastResults" },
  { href: "/profile", icon: User, labelKey: "nav.profile" },
];

const adminItems = [
  { href: "/admin/training", icon: Dumbbell, labelKey: "nav.training" },
  { href: "/admin/model", icon: BrainCircuit, labelKey: "nav.modelInfo" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === ROLES.ADMIN;

  const mainItems = navItems;
  const extraItems = isAdmin ? adminItems : [];

  const renderNavItem = (item) => {
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + "/");

    const link = (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200",
          collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-xl bg-sidebar-accent"
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          />
        )}
        <item.icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
        {!collapsed && (
          <span className="relative z-10 truncate">{t(item.labelKey)}</span>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="text-xs font-medium"
            sideOffset={8}
          >
            {t(item.labelKey)}
          </TooltipContent>
        </Tooltip>
      );
    }
    return link;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", bounce: 0.08, duration: 0.4 }}
        className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border shrink-0"
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-14 border-b border-sidebar-border shrink-0",
            collapsed ? "justify-center px-2" : "gap-2.5 px-4"
          )}
        >
          <div className="p-1.5 rounded-lg bg-primary shrink-0">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-[15px] font-semibold tracking-tight text-foreground"
              >
                Pashumitra
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {mainItems.map(renderNavItem)}

          {extraItems.length > 0 && (
            <>
              <div className={cn("pt-4 pb-1", collapsed ? "px-0" : "px-3")}>
                {!collapsed ? (
                  <p className="text-[11px] font-medium uppercase tracking-widest text-sidebar-foreground/40">
                    {t("nav.admin")}
                  </p>
                ) : (
                  <div className="mx-auto h-px w-6 bg-sidebar-border" />
                )}
              </div>
              {extraItems.map(renderNavItem)}
            </>
          )}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 transition-colors"
        >
          {collapsed ? (
            <ChevronsRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronsLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </motion.aside>
    </TooltipProvider>
  );
}
