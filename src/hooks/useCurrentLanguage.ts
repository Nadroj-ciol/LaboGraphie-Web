import { DEFAULT_LANGUAGE, isSupportedLanguage } from "@/i18n/config";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

/**
 * Langue à utiliser pour générer un lien/une navigation à l'instant présent :
 * priorité au segment ":lang" de l'URL courante (pages publiques), puis à la
 * langue i18next active (ex. depuis le dashboard, qui n'a pas de préfixe),
 * puis au français par défaut.
 */
export function useCurrentLanguage() {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  if (isSupportedLanguage(paramLang)) return paramLang;
  if (isSupportedLanguage(i18n.language)) return i18n.language;
  return DEFAULT_LANGUAGE;
}
