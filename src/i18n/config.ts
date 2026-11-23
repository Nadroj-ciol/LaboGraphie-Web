import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = ["fr", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = "fr";
export const LANGUAGE_STORAGE_KEY = "labographie-lang";

export function isSupportedLanguage(value: string | undefined): value is SupportedLanguage {
  return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

/** Langue à utiliser au premier accès (route "/"), avant tout choix explicite :
 * préférence mémorisée > langue du navigateur > français par défaut. */
export function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(stored)) return stored;

  const browserLang = window.navigator.language?.slice(0, 2).toLowerCase();
  if (isSupportedLanguage(browserLang)) return browserLang;

  return DEFAULT_LANGUAGE;
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: detectInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  returnEmptyString: false,
});

export default i18n;
