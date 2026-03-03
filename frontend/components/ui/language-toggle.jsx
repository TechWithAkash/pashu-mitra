"use client";

import { Globe, Loader2 } from "lucide-react";
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          className={`h-8 w-8 rounded-lg ${className}`}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-elevated">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`rounded-lg cursor-pointer ${
              language === lang.code
                ? "bg-primary/10 text-primary font-medium"
                : ""
            }`}
          >
            <span>{lang.nativeLabel}</span>
            {language === lang.code && (
              <span className="ml-auto text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
