import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { withLangPrefix } from "@/i18n/path";
import { useCallback } from "react";
import { type NavigateOptions, type To, useNavigate } from "react-router-dom";

/**
 * Équivalent de useNavigate() de react-router, mais préfixe automatiquement
 * les chemins internes avec la langue courante (voir LocalizedLink pour le
 * même principe appliqué aux liens déclaratifs).
 */
export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const lang = useCurrentLanguage();

  return useCallback(
    (to: To, options?: NavigateOptions) => {
      const resolvedTo = typeof to === "string" ? withLangPrefix(to, lang) : to;
      navigate(resolvedTo, options);
    },
    [navigate, lang],
  );
}
