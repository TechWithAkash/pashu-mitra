"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getEnglishStrings,
  loadCachedTranslations,
  translateAll,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "@/lib/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [strings, setStrings] = useState(getEnglishStrings());
  const [isTranslating, setIsTranslating] = useState(false);

  // On mount, restore saved language + cached translations
  useEffect(() => {
    const saved = localStorage.getItem("pashumitra-lang");
    if (saved && saved !== "en") {
      setLanguage(saved);
      // Try to load cached translations synchronously
      const cached = loadCachedTranslations(saved);
      if (cached) {
        setStrings(cached);
      } else {
        // Fetch translations async via our server-side API route
        setIsTranslating(true);
        translateAll(saved).then((translated) => {
          setStrings(translated);
          setIsTranslating(false);
        });
      }
    }
  }, []);

  const changeLanguage = useCallback(async (code) => {
    setLanguage(code);
    localStorage.setItem("pashumitra-lang", code);

    if (code === "en") {
      setStrings(getEnglishStrings());
      return;
    }

    // Try cache first (sync)
    const cached = loadCachedTranslations(code);
    if (cached) {
      setStrings(cached);
      return;
    }

    // Fetch from our API route (server proxies to Google Translate)
    setIsTranslating(true);
    const translated = await translateAll(code);
    setStrings(translated);
    setIsTranslating(false);
  }, []);

  const t = useCallback(
    (key) => {
      return strings[key] || getEnglishStrings()[key] || key;
    },
    [strings]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        isTranslating,
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
