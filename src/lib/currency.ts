import type { ExchangeRates } from "@/hooks/usePricing";

export type Currency = "FCFA" | "EUR" | "USD";

/**
 * Formate un montant stocké en FCFA dans la devise demandée.
 * Utilisé partout où un devis est affiché (calculateur, dashboard admin,
 * espace client) pour que le montant reconverti soit cohérent d'un bout
 * à l'autre du parcours, au lieu de toujours réafficher du FCFA brut.
 */
export function formatCurrency(amountFCFA: number, currency: Currency, rates: ExchangeRates): string {
  const rate = currency === "FCFA" ? 1 : rates[currency];
  const amount = amountFCFA / rate;

  if (currency === "FCFA") {
    return `${Math.round(amount).toLocaleString("fr-FR").replace(/,/g, " ")} FCFA`;
  }

  return new Intl.NumberFormat(currency === "EUR" ? "fr-FR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Vérifie qu'une chaîne issue de la base est bien une devise connue,
 * avec repli sur FCFA pour les anciennes lignes sans devise persistée. */
export function toCurrency(value: string | null | undefined): Currency {
  return value === "EUR" || value === "USD" ? value : "FCFA";
}
