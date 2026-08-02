-- =============================================================================
-- SECTION : STORAGE (BUCKETS)
-- Création du bucket pour les avatars de profil
-- =============================================================================

-- 1. Création du bucket public 'avatars'
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Mise en place des politiques de sécurité (RLS) sur la table storage.objects

-- Les images de profil sont publiques : n'importe qui peut les voir.
CREATE POLICY "Avatar images are publicly accessible."
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Un utilisateur authentifié peut uploader une image uniquement dans son propre dossier.
-- (Le nom du fichier devra commencer par l'ID de l'utilisateur : uid/mon-image.jpg)
CREATE POLICY "Users can upload their own avatar."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Un utilisateur peut mettre à jour son image s'il l'avait déjà uploadée.
CREATE POLICY "Users can update their own avatar."
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Un utilisateur peut supprimer son image.
CREATE POLICY "Users can delete their own avatar."
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
