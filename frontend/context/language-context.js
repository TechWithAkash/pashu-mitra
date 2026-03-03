"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  getEnglishStrings,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "@/lib/translations";

const LanguageContext = createContext(null);

/**
 * Attempt to set the Google Translate widget to a specific language.
 * Polls for the widget's <select> element since it loads async.
 */
function setWidgetLanguage(langCode) {
  function trySet() {
    const select = document.querySelector(".goog-te-combo");
    if (!select) return false;

    if (langCode === "en") {
      // Reset to original English
      select.value = "";
      select.dispatchEvent(new Event("change"));
      // Clear googtrans cookies
      document.cookie =
        "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie =
        "googtrans=; path=/; domain=" +
        window.location.hostname +
        "; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      // If page is still marked translated after 600ms, hard reload
      setTimeout(() => {
        if (document.documentElement.classList.contains("translated-ltr") ||
            document.documentElement.classList.contains("translated-rtl")) {
          window.location.reload();
        }
      }, 600);
    } else {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
    return true;
  }

  // Try immediately
  if (trySet()) return;

  // Widget not ready yet — poll up to 6 seconds
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (trySet() || attempts > 20) {
      clearInterval(interval);
    }
  }, 300);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const en = getEnglishStrings();
  const scriptLoaded = useRef(false);

  // Load the Google Translate widget on mount
  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    // Build comma-separated language codes (excluding English)
    const langCodes = SUPPORTED_LANGUAGES
      .filter((l) => l.code !== "en")
      .map((l) => l.code)
      .join(",");

    // Define the global callback that Google's script will invoke
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: langCodes,
          autoDisplay: false,
        },
        "google_translate_element"
      );

      // After widget initialises, restore saved language
      const saved = localStorage.getItem("pashumitra-lang");
      if (saved && saved !== "en") {
        setLanguage(saved);
        // Small delay to let widget create its <select>
        setTimeout(() => setWidgetLanguage(saved), 500);
      }
    };

    // Inject the script
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
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
      {/* Container for Google Translate widget — positioned off-screen, never display:none */}
      <div
        id="google_translate_element"
        style={{
          position: "fixed",
          top: "-200px",
          left: "-200px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      />
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
