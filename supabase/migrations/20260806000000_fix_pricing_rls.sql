-- =============================================================================
-- CORRECTIF SÉCURITÉ : restreindre l'écriture sur system_settings et
-- service_pricing aux administrateurs uniquement.
--
-- Les policies créées dans 20260105000003_tjm_management.sql autorisaient
-- à tort N'IMPORTE QUEL utilisateur authentifié (pas seulement les admins)
-- à modifier les tarifs des services et les taux de change :
--   USING ( auth.role() = 'authenticated' )
-- Cette migration les remplace par des policies scopées au rôle admin,
-- sur le modèle de "Admins can update blogs" (20260105000000_initial_schema.sql).
-- =============================================================================

-- system_settings
DROP POLICY IF EXISTS "Users can update system settings." ON public.system_settings;

CREATE POLICY "Admins can insert system settings"
  ON public.system_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update system settings"
  ON public.system_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete system settings"
  ON public.system_settings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- service_pricing
DROP POLICY IF EXISTS "Users can update service pricing." ON public.service_pricing;

CREATE POLICY "Admins can insert service pricing"
  ON public.service_pricing FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service pricing"
  ON public.service_pricing FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service pricing"
  ON public.service_pricing FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Les policies de lecture publique ("Public profiles are viewable by everyone.")
-- définies dans 20260105000003_tjm_management.sql restent inchangées :
-- system_settings et service_pricing doivent rester lisibles par tous
-- (calculateur de devis, page tarifs publique).
