import { NextResponse } from "next/server";

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const CHUNK_SIZE = 100; // Google allows up to 128 segments per request

export async function POST(request) {
  try {
    if (!GOOGLE_TRANSLATE_API_KEY) {
      return NextResponse.json(
        { error: "Google Translate API key not configured" },
        { status: 500 }
      );
    }

    const { texts, target } = await request.json();

    if (!texts?.length || !target) {
      return NextResponse.json(
        { error: "Missing texts array or target language code" },
        { status: 400 }
      );
    }

    const allTranslated = [];

    for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
      const chunk = texts.slice(i, i + CHUNK_SIZE);

      const params = new URLSearchParams({
        key: GOOGLE_TRANSLATE_API_KEY,
        target,
        source: "en",
        format: "text",
      });
      chunk.forEach((text) => params.append("q", text));

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?${params.toString()}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errBody = await response.text();
        console.error("Google Translate API error:", response.status, errBody);
        return NextResponse.json(
          { error: "Translation API returned an error" },
          { status: 502 }
        );
      }

      const data = await response.json();
      const translations = data.data.translations.map((t) => t.translatedText);
      allTranslated.push(...translations);
    }

    return NextResponse.json({ translations: allTranslated });
  } catch (err) {
    console.error("Translation route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
