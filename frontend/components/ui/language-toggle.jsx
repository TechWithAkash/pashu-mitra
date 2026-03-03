"use client";

import { Globe, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function LanguageToggle({ variant = "ghost", className = "" }) {
  const { language, changeLanguage, isTranslating, SUPPORTED_LANGUAGES } =
    useLanguage();

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={`gap-1.5 rounded-lg px-2.5 h-8 text-xs font-medium ${className}`}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Globe className="h-3.5 w-3.5" />
          )}
          <span className="notranslate hidden sm:inline">
            {isTranslating
              ? "Translating..."
              : currentLang?.nativeLabel || "English"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="notranslate w-48 rounded-xl shadow-elevated max-h-80 overflow-y-auto"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`rounded-lg cursor-pointer flex items-center justify-between ${
              language === lang.code
                ? "bg-primary/10 text-primary font-medium"
                : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="text-sm">{lang.nativeLabel}</span>
              {lang.code !== "en" && (
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {lang.label}
                </span>
              )}
            </div>
            {language === lang.code && (
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
