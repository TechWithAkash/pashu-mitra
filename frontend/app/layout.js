import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pashumitra - AI-Powered Cattle Disease Detection",
  description:
    "Detect Lumpy Skin Disease in cattle instantly using advanced AI. Upload a photo and get actionable insights with GradCAM explainability.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </LanguageProvider>
        </AuthProvider>

        {/* Google Translate Widget — hidden container kept in DOM for JS access */}
        <div id="google_translate_element" />

        {/* Define the init callback before the widget script loads */}
        <Script id="google-translate-init" strategy="beforeInteractive">
          {`function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'hi,mr,ta,te,bn,gu,kn,ml,pa,or',
    autoDisplay: false
  }, 'google_translate_element');
}`}
        </Script>

        {/* Load the Google Translate widget */}
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
