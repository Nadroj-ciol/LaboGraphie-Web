import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { withLangPrefix } from "@/i18n/path";
import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

/**
 * Remplace <Link> de react-router : préfixe automatiquement les chemins
 * internes ("/quote" -> "/fr/quote") avec la langue courante, pour que les
 * liens de navigation ne fassent jamais changer la langue implicitement.
 * Les liens externes/protocoles (tel:, mailto:, http(s)://) et les routes
 * dashboard passent inchangés.
 *
 * Usage : `import { LocalizedLink as Link } from "@/components/LocalizedLink"`
 * pour remplacer l'import de react-router-dom sans toucher au JSX existant.
 */
export const LocalizedLink = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...props }, ref) => {
  const lang = useCurrentLanguage();
  const resolvedTo = typeof to === "string" ? withLangPrefix(to, lang) : to;

  return <Link ref={ref} to={resolvedTo} {...props} />;
});
LocalizedLink.displayName = "LocalizedLink";

export default LocalizedLink;
