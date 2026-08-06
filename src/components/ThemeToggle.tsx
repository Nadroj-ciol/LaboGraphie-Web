import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  /** Utilisé sur les zones à fond sombre (header transparent sur le hero, tiroir mobile...)
   * pour garder une piste lisible avant même le montage côté client. */
  isDark?: boolean;
  className?: string;
}

/**
 * Bouton "poussoir" clair/sombre : une piste arrondie à l'aspect mécanique
 * (ombre interne) et un curseur circulaire qui glisse entre une icône Soleil
 * et une icône Lune, avec rotation/fondu à la bascule.
 */
export function ThemeToggle({ isDark = false, className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  // Évite un flash d'état incorrect pendant l'hydratation (le thème n'est
  // connu qu'après le montage côté client, next-themes lit localStorage).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDarkTheme = mounted && resolvedTheme === "dark";

  const toggle = () => setTheme(isDarkTheme ? "light" : "dark");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkTheme}
      aria-label={isDarkTheme ? "Passer en mode clair" : "Passer en mode sombre"}
      onClick={toggle}
      className={`group relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 ${
        isDarkTheme ? "bg-secondary" : isDark ? "bg-white/15" : "bg-muted"
      } shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)] ${className}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-tertiary shadow-md transition-transform duration-300 ease-in-out ${
          isDarkTheme ? "translate-x-6" : "translate-x-0"
        }`}
      >
        <Sun
          className={`absolute h-3.5 w-3.5 text-primary transition-all duration-300 ${
            isDarkTheme ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute h-3.5 w-3.5 text-primary transition-all duration-300 ${
            isDarkTheme ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}
