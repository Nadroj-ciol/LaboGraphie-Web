import { isSupportedLanguage, LANGUAGE_STORAGE_KEY } from "@/i18n/config";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";

/**
 * Route parente de toutes les pages publiques ("/:lang/..."). Valide le
 * segment de langue de l'URL, synchronise i18next + l'attribut lang du
 * document, et mémorise le choix pour les prochaines visites via "/".
 */
export function LanguageLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!isSupportedLanguage(lang)) return;

    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang, i18n]);

  if (!isSupportedLanguage(lang)) {
    return <NotFound />;
  }

  return <Outlet />;
}

export default LanguageLayout;
