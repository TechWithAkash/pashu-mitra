"use client";

import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Menu,
  LogOut,
  User,
  Shield,
  LayoutDashboard,
  ScanLine,
  History,
  Dumbbell,
  BrainCircuit,
  ChevronDown,
} from "lucide-react";
import { ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import LanguageToggle from "@/components/ui/language-toggle";

const pageTitleKeys = {
  "/dashboard": "dashboard.title",
  "/predict": "predict.title",
  "/history": "history.title",
  "/profile": "profile.title",
  "/admin/training": "training.title",
  "/admin/model": "model.title",
};

const mobileNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.home" },
  { href: "/predict", icon: ScanLine, labelKey: "nav.checkAnimal" },
  { href: "/history", icon: History, labelKey: "nav.pastResults" },
  { href: "/profile", icon: User, labelKey: "nav.profile" },
];

const mobileAdminItems = [
  { href: "/admin/training", icon: Dumbbell, labelKey: "nav.training" },
  { href: "/admin/model", icon: BrainCircuit, labelKey: "nav.modelInfo" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const isAdmin = user?.role === ROLES.ADMIN;

  const title = t(Object.entries(pageTitleKeys).find(([path]) =>
    pathname.startsWith(path)
  )?.[1] || "dashboard.title");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const allMobileItems = isAdmin
    ? [...mobileNavItems, ...mobileAdminItems]
    : mobileNavItems;

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-14 glass-subtle border-b flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30"
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 rounded-lg"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-5 border-b">
              <SheetTitle className="flex items-center gap-2.5">
                <div className="p-1.5 bg-primary rounded-lg">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-[15px] font-semibold tracking-tight">
                  Pashumitra
                </span>
              </SheetTitle>
            </SheetHeader>
            <nav className="p-3 space-y-1">
              {allMobileItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-col">
          <h1 className="text-[15px] font-semibold tracking-tight leading-none">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Language toggle + User menu */}
      <div className="flex items-center gap-2">
        <LanguageToggle />
        {/* User menu */}
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2.5 px-2 py-1.5 h-auto rounded-xl hover:bg-muted/80 transition-colors duration-200"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-[13px] font-medium text-foreground">
              {user?.name}
            </span>
            <ChevronDown className="hidden sm:block h-3 w-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52 rounded-xl shadow-elevated p-1.5"
          sideOffset={8}
        >
          <div className="px-2.5 py-2">
            <p className="text-[13px] font-semibold">{user?.name}</p>
            <p className="text-[11px] text-muted-foreground capitalize mt-0.5">
              {user?.role}
            </p>
          </div>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem asChild className="rounded-lg text-[13px] py-2 cursor-pointer">
            <Link href="/profile">
              <User className="h-3.5 w-3.5 mr-2" />
              {t("common.profile")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            onClick={logout}
            className="rounded-lg text-[13px] py-2 text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            {t("common.signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </motion.header>
  );
}
