import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import {
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/i18n/config";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface LanguageSwitcherProps {
  /** Zones à fond sombre (header transparent sur le hero, tiroir mobile...). */
  isDark?: boolean;
  className?: string;
}

/** Sélecteur FR/EN — pilule à deux segments, dans le même esprit visuel
 * que ThemeToggle. Change la langue et, si on est sur une page publique
 * ("/:lang/..."), navigue vers l'équivalent dans l'autre langue. */
export function LanguageSwitcher({ isDark = false, className = "" }: LanguageSwitcherProps) {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const currentLang = useCurrentLanguage();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const switchTo = (target: SupportedLanguage) => {
    if (target === currentLang) return;

    i18n.changeLanguage(target);
    document.documentElement.lang = target;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, target);

    if (isSupportedLanguage(paramLang)) {
      // Remplace uniquement le segment de langue, garde le reste du chemin.
      const rest = location.pathname.replace(/^\/(fr|en)/, "");
      navigate(`/${target}${rest}${location.search}${location.hash}`);
    }
    // Hors "/:lang" (ex. dashboard) : rien à naviguer, seule la langue change.
  };

  return (
    <div
      role="group"
      aria-label="Changer de langue"
      className={`inline-flex items-center rounded-full p-1 text-xs font-bold shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)] ${
        isDark ? "bg-white/15" : "bg-muted"
      } ${className}`}
    >
      {SUPPORTED_LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          aria-pressed={currentLang === code}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors duration-300 ${
            currentLang === code
              ? "bg-tertiary text-primary shadow-sm"
              : isDark
                ? "text-white/70 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
