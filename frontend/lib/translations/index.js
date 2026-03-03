import en from "./en";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
];

export const DEFAULT_LANGUAGE = "en";

const GOOGLE_TRANSLATE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
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
 * Batch-translate all English strings to a target language using Google Translate API.
 * Returns a dictionary { key: translatedString }.
 */
export async function translateAll(targetLangCode) {
  if (targetLangCode === "en") return en;

  // Check cache first
  const cached = loadCachedTranslations(targetLangCode);
  if (cached) return cached;

  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn("Google Translate API key not configured. Falling back to English.");
    return en;
  }

  const keys = Object.keys(en);
  const values = Object.values(en);

  // Google Translate API allows up to 128 segments per request.
  // Batch in chunks of 100 to be safe.
  const CHUNK_SIZE = 100;
  const translatedValues = [];

  for (let i = 0; i < values.length; i += CHUNK_SIZE) {
    const chunk = values.slice(i, i + CHUNK_SIZE);

    const params = new URLSearchParams({
      key: GOOGLE_TRANSLATE_API_KEY,
      target: targetLangCode,
      source: "en",
      format: "text",
    });
    chunk.forEach((text) => params.append("q", text));

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?${params.toString()}`,
        { method: "POST" }
      );

      if (!response.ok) {
        console.error("Google Translate API error:", response.status);
        return en; // Fallback to English
      }

      const data = await response.json();
      const translations = data.data.translations.map((t) => t.translatedText);
      translatedValues.push(...translations);
    } catch (err) {
      console.error("Translation failed:", err);
      return en; // Fallback to English
    }
  }

  // Build translated dictionary
  const translated = {};
  keys.forEach((key, index) => {
    translated[key] = translatedValues[index] || en[key];
  });

  // Cache for future use
  saveCachedTranslations(targetLangCode, translated);

  return translated;
}
