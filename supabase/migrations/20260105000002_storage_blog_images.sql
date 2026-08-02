-- =============================================================================
-- SECTION : STORAGE (BUCKETS)
-- Création du bucket pour les images des articles de blog
-- =============================================================================

-- 1. Création du bucket public 'blog_images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog_images', 'blog_images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Mise en place des politiques de sécurité (RLS) sur la table storage.objects

-- Les images de blog sont publiques : n'importe qui peut les voir.
CREATE POLICY "Blog images are publicly accessible."
ON storage.objects FOR SELECT
USING (bucket_id = 'blog_images');

-- Seuls les administrateurs peuvent uploader une image.
CREATE POLICY "Admins can upload blog images."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog_images' AND
  public.has_role(auth.uid(), 'admin')
);

-- Seuls les administrateurs peuvent mettre à jour une image.
CREATE POLICY "Admins can update blog images."
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog_images' AND
  public.has_role(auth.uid(), 'admin')
);

-- Seuls les administrateurs peuvent supprimer une image.
CREATE POLICY "Admins can delete blog images."
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog_images' AND
  public.has_role(auth.uid(), 'admin')
);
