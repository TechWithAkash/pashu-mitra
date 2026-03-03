import en from "./en";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളം" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", nativeLabel: "ଓଡ଼ିଆ" },
];

export const DEFAULT_LANGUAGE = "en";

const CACHE_PREFIX = "pashumitra-translations-";

/**
 * Get all English source strings as a flat object.
 */
export function getEnglishStrings() {
  return en;
}

/**
 * Load cached translations from localStorage for a given language.
 */
export function loadCachedTranslations(langCode) {
  if (langCode === "en") return en;
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + langCode);
    if (cached) return JSON.parse(cached);
  } catch {
    // Cache miss or corrupt data
  }
  return null;
}

/**
 * Save translations to localStorage cache.
 */
function saveCachedTranslations(langCode, translations) {
  try {
    localStorage.setItem(CACHE_PREFIX + langCode, JSON.stringify(translations));
  } catch {
    // localStorage full or unavailable
  }
}

/**
 * Translate all English strings to a target language via our server-side
 * API route (/api/translate), which uses the Google Translate API key
 * securely on the server.
 */
export async function translateAll(targetLangCode) {
  if (targetLangCode === "en") return en;

  // Check cache first
  const cached = loadCachedTranslations(targetLangCode);
  if (cached) return cached;

  const keys = Object.keys(en);
  const values = Object.values(en);

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: values, target: targetLangCode }),
    });

    if (!response.ok) {
      console.error("Translation API error:", response.status);
      return en;
    }

    const { translations } = await response.json();

    // Build translated dictionary
    const translated = {};
    keys.forEach((key, index) => {
      translated[key] = translations[index] || en[key];
    });

    // Cache for future use
    saveCachedTranslations(targetLangCode, translated);

    return translated;
  } catch (err) {
    console.error("Translation failed:", err);
    return en;
  }
}
