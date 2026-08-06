-- =============================================================================
-- Ajoute une colonne 'currency' structurée sur quote_requests.
--
-- Jusqu'ici, estimated_min/estimated_max étaient toujours stockés en FCFA
-- quelle que soit la devise choisie par le client sur le calculateur
-- (QuoteCalculator.tsx utilise localTJM en FCFA pour "FCFA" et intlTJM,
-- également en FCFA, pour "EUR"/"USD" — aucune conversion n'était
-- persistée). La seule trace de la devise voulue par le client était du
-- texte libre noyé dans la colonne 'notes' ("Devise: USD"). Résultat :
-- l'admin et le client revoyaient toujours des montants en FCFA, même
-- pour un devis explicitement demandé en EUR/USD.
-- =============================================================================

ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'FCFA';

COMMENT ON COLUMN public.quote_requests.currency IS
  'Devise choisie par le client sur le calculateur (FCFA, EUR ou USD). '
  'estimated_min/estimated_max restent stockés en FCFA ; cette colonne '
  'indique dans quelle devise les reconvertir/afficher.';
