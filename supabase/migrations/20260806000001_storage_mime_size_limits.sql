-- =============================================================================
-- DURCISSEMENT SÉCURITÉ : restreindre les buckets publics 'avatars' et
-- 'blog_images' aux types MIME image et à une taille raisonnable.
--
-- Jusqu'ici, seules les limites côté client (AvatarUpload.tsx,
-- BlogImageUpload.tsx) empêchaient l'upload de fichiers non-image ou trop
-- volumineux — contournable en appelant l'API Storage directement.
-- =============================================================================

UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
  file_size_limit = 2 * 1024 * 1024 -- 2 Mo, aligné sur la limite déjà imposée par AvatarUpload.tsx
WHERE id = 'avatars';

UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
  file_size_limit = 5 * 1024 * 1024 -- 5 Mo, aligné sur la limite déjà imposée par BlogImageUpload.tsx
WHERE id = 'blog_images';
