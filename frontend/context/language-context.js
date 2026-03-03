"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getEnglishStrings,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "@/lib/translations";

const LanguageContext = createContext(null);

/**
 * Programmatically switch the Google Translate widget to a language.
 * Polls for the widget's internal <select> (.goog-te-combo) since it
 * loads asynchronously from translate.google.com.
 */
function setWidgetLanguage(langCode) {
  function trySet() {
    const select = document.querySelector(".goog-te-combo");
    if (!select) return false;

    if (langCode === "en") {
      // Reset to original English
      select.value = "";
      select.dispatchEvent(new Event("change"));
      // Clear googtrans cookies so the widget doesn't auto-restore
      document.cookie =
        "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie =
        "googtrans=; path=/; domain=" +
        window.location.hostname +
        "; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      // If page is still marked as translated after a delay, reload to reset
      setTimeout(() => {
        if (
          document.documentElement.classList.contains("translated-ltr") ||
          document.documentElement.classList.contains("translated-rtl")
        ) {
          window.location.reload();
        }
      }, 800);
    } else {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
    return true;
  }

  // Try immediately
  if (trySet()) return;

  // Widget not ready yet — poll up to 12 seconds (40 × 300ms)
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (trySet() || attempts > 40) {
      clearInterval(interval);
    }
  }, 300);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const en = getEnglishStrings();

  // Restore saved language preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("pashumitra-lang");
    if (saved && saved !== "en") {
      setLanguage(saved);
      // Give the widget time to initialize before switching
      setTimeout(() => setWidgetLanguage(saved), 1500);
    }
  }, []);

  const changeLanguage = useCallback((code) => {
    setLanguage(code);
    localStorage.setItem("pashumitra-lang", code);
    setWidgetLanguage(code);
  }, []);

  // t() returns the English source string.
  // The Google Translate widget translates the rendered DOM text automatically.
  const t = useCallback((key) => en[key] || key, [en]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        isTranslating: false,
        SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
