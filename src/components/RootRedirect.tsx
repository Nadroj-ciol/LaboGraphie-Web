import { detectInitialLanguage } from "@/i18n/config";
import { Navigate } from "react-router-dom";

/** Route "/" : redirige immédiatement vers la langue détectée ("/fr" ou "/en"),
 * sans jamais rendre de contenu sous "/" elle-même. */
export function RootRedirect() {
  const lang = detectInitialLanguage();
  return <Navigate to={`/${lang}`} replace />;
}

export default RootRedirect;
