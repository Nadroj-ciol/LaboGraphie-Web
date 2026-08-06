-- =============================================================================
-- SECTION : STORAGE (BUCKETS)
-- Création du bucket pour les CV de candidature.
--
-- Contrairement aux avatars/images de blog, ce bucket n'est PAS public :
-- les CV sont des documents personnels de candidats, ils ne doivent être
-- lisibles que par les administrateurs (via URL signée), jamais par une
-- URL publique directe.
-- =============================================================================

-- 1. Création du bucket privé 'job_cvs'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job_cvs',
  'job_cvs',
  false,
  10 * 1024 * 1024, -- 10 Mo
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'text/plain'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Mise en place des politiques de sécurité (RLS) sur la table storage.objects

-- Le formulaire de candidature est public : n'importe qui (connecté ou non)
-- peut déposer un CV, mais seulement en écriture (pas de lecture).
CREATE POLICY "Anyone can upload a CV."
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'job_cvs'
);

-- Seuls les administrateurs peuvent lister/télécharger les CV.
CREATE POLICY "Admins can read CVs."
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'job_cvs' AND
  public.has_role(auth.uid(), 'admin')
);

-- Seuls les administrateurs peuvent supprimer un CV (nettoyage).
CREATE POLICY "Admins can delete CVs."
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'job_cvs' AND
  public.has_role(auth.uid(), 'admin')
);
