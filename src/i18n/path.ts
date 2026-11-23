/**
 * Préfixe un chemin interne avec le segment de langue courant, sauf s'il
 * s'agit d'un lien externe/protocole (tel:, mailto:, http(s):, #...), d'un
 * chemin déjà préfixé, ou d'une route dashboard (qui reste hors i18n).
 */
export function withLangPrefix(to: string, lang: string): string {
  if (!to.startsWith("/")) return to; // relatif, ancre, protocole (tel:, mailto:...)
  if (/^\/(fr|en)(\/|$)/.test(to)) return to; // déjà préfixé
  if (to.startsWith("/dashboard")) return to; // dashboard hors i18n

  return to === "/" ? `/${lang}` : `/${lang}${to}`;
}
