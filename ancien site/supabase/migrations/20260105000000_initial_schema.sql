-- =============================================================================
-- LABOGRAPHIE — SCHÉMA INITIAL DE BASE DE DONNÉES
-- Auteur : LaboGraphie
-- Date   : 2026-01-05
-- =============================================================================
-- Ce fichier est la source unique de vérité pour l'architecture de la base de
-- données. Il contient la définition complète et finale de toutes les tables,
-- fonctions, triggers et politiques de sécurité (RLS).
-- =============================================================================


-- =============================================================================
-- SECTION 1 : TYPES PERSONNALISÉS
-- =============================================================================

-- Enum pour les rôles d'utilisateurs dans l'application
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;


-- =============================================================================
-- SECTION 2 : FONCTIONS UTILITAIRES
-- =============================================================================

-- Fonction générique pour mettre à jour automatiquement le champ `updated_at`
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SET search_path = public;

-- Fonction de sécurité pour vérifier le rôle d'un utilisateur
-- (SECURITY DEFINER permet de lire la table user_roles sans exposer de données)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fonction de trigger pour créer automatiquement le profil d'un nouvel utilisateur
-- Version finale : inclut full_name et phone depuis les métadonnées d'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$function$;


-- =============================================================================
-- SECTION 3 : GESTION DES UTILISATEURS & RÔLES
-- =============================================================================

-- Table des rôles (liaison entre un utilisateur et ses droits d'accès)
CREATE TABLE public.user_roles (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir la liste des rôles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Blocage explicite des accès anonymes
CREATE POLICY "Block anonymous access to user_roles"
  ON public.user_roles FOR SELECT
  TO anon
  USING (false);


-- Table des profils publics (données complémentaires liées à auth.users)
CREATE TABLE public.profiles (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  phone      TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Un utilisateur peut voir et modifier son propre profil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Les admins peuvent voir tous les profils (pour le support)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Blocage explicite des accès anonymes
CREATE POLICY "Block anonymous access to profiles"
  ON public.profiles FOR SELECT
  TO anon
  USING (false);

-- Trigger : crée automatiquement un profil à l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger : mise à jour du timestamp sur les profils
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- =============================================================================
-- SECTION 4 : BLOG
-- =============================================================================

CREATE TABLE public.blogs (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  image_url   TEXT,
  category    TEXT NOT NULL DEFAULT 'Non classé',
  read_time   TEXT DEFAULT '5 min de lecture',
  is_featured BOOLEAN DEFAULT false,
  published   BOOLEAN DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Lecture publique des articles publiés
CREATE POLICY "Anyone can view published blogs"
  ON public.blogs FOR SELECT
  USING (published = true);

-- Les admins ont un accès complet (lecture sur tous, écriture, modification, suppression)
CREATE POLICY "Admins can view all blogs"
  ON public.blogs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blogs"
  ON public.blogs FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blogs"
  ON public.blogs FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blogs"
  ON public.blogs FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Index pour les performances sur le slug (utilisé dans l'URL)
CREATE INDEX idx_blogs_slug      ON public.blogs(slug);
CREATE INDEX idx_blogs_published ON public.blogs(published);

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- =============================================================================
-- SECTION 5 : DEMANDES DE DEVIS
-- =============================================================================

CREATE TABLE public.quote_requests (
  id                    UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Liaison optionnelle à un utilisateur enregistré (SET NULL pour garder l'historique)
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Informations de contact
  full_name             TEXT NOT NULL,
  phone                 TEXT NOT NULL,
  email                 TEXT,

  -- Détails du devis (provenant du calculateur)
  service_slug          TEXT NOT NULL,
  service_title         TEXT NOT NULL,
  complexity_label      TEXT NOT NULL,
  complexity_multiplier NUMERIC NOT NULL DEFAULT 1,
  estimated_hours       NUMERIC NOT NULL,
  urgency               TEXT NOT NULL DEFAULT 'standard',
  base_price            NUMERIC NOT NULL,
  estimated_min         NUMERIC NOT NULL,
  estimated_max         NUMERIC NOT NULL,
  service_date          DATE,

  -- Notes complémentaires
  notes                 TEXT,

  -- Suivi du statut
  status                TEXT NOT NULL DEFAULT 'pending',

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- N'importe qui peut soumettre un devis (formulaire public)
CREATE POLICY "Anyone can submit quote requests"
  ON public.quote_requests FOR INSERT
  WITH CHECK (true);

-- Un utilisateur connecté peut voir ses propres devis
CREATE POLICY "Users can view their own quotes"
  ON public.quote_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Les admins ont accès complet
CREATE POLICY "Admins can view all quote requests"
  ON public.quote_requests FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quote requests"
  ON public.quote_requests FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quote requests"
  ON public.quote_requests FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Index pour les performances
CREATE INDEX idx_quote_requests_user_id ON public.quote_requests(user_id);
CREATE INDEX idx_quote_requests_status  ON public.quote_requests(status);

CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- =============================================================================
-- SECTION 6 : FORMULAIRE DE CONTACT
-- =============================================================================

CREATE TABLE public.contacts (
  id        UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone     TEXT NOT NULL,
  email     TEXT,
  service   TEXT,
  notes     TEXT,
  status    TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- N'importe qui peut soumettre le formulaire de contact
CREATE POLICY "Anyone can submit contact"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

-- Seuls les admins authentifiés peuvent lire, modifier ou supprimer les contacts
CREATE POLICY "Only admins can read contacts"
  ON public.contacts FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contacts"
  ON public.contacts FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contacts"
  ON public.contacts FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Index de performance
CREATE INDEX idx_contacts_status ON public.contacts(status);

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- =============================================================================
-- SECTION 7 : CARRIÈRES & CANDIDATURES
-- =============================================================================

CREATE TABLE public.careers (
  id               UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  type             TEXT NOT NULL DEFAULT 'Full-time',
  location         TEXT NOT NULL,
  about_the_role   TEXT[] NOT NULL DEFAULT '{}',
  short_term_goals TEXT[] NOT NULL DEFAULT '{}',
  what_you_bring   TEXT[] NOT NULL DEFAULT '{}',
  why_you_might_love TEXT[] NOT NULL DEFAULT '{}',
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.job_applications (
  id              UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- SET NULL pour conserver l'historique de candidature si le poste est supprimé
  career_id       UUID REFERENCES public.careers(id) ON DELETE SET NULL,
  job_title       TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  current_company TEXT,
  linkedin_url    TEXT,
  cv_link         TEXT,
  note            TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.careers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Les offres actives sont visibles de tous
CREATE POLICY "Anyone can view active careers"
  ON public.careers FOR SELECT
  USING (is_active = true);

-- Les admins ont accès complet sur les carrières
CREATE POLICY "Admins can view all careers"
  ON public.careers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert careers"
  ON public.careers FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update careers"
  ON public.careers FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete careers"
  ON public.careers FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- N'importe qui peut postuler
CREATE POLICY "Anyone can submit job applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (true);

-- Seuls les admins peuvent gérer les candidatures
CREATE POLICY "Admins can view all job applications"
  ON public.job_applications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update job applications"
  ON public.job_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete job applications"
  ON public.job_applications FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Index de performance
CREATE INDEX idx_careers_slug         ON public.careers(slug);
CREATE INDEX idx_careers_is_active    ON public.careers(is_active);
CREATE INDEX idx_job_applications_career_id ON public.job_applications(career_id);
CREATE INDEX idx_job_applications_status    ON public.job_applications(status);

CREATE TRIGGER update_careers_updated_at
  BEFORE UPDATE ON public.careers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- =============================================================================
-- SECTION 8 : DEMANDES DE SERVICES
-- =============================================================================

CREATE TABLE public.service_inquiries (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- SET NULL pour garder l'historique si l'utilisateur supprime son compte
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  full_name    TEXT NOT NULL,
  phone        TEXT NOT NULL,
  note         TEXT,
  status       TEXT NOT NULL DEFAULT 'new',
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

-- N'importe qui (connecté ou non) peut soumettre une demande de service
CREATE POLICY "Anyone can submit service inquiries"
  ON public.service_inquiries FOR INSERT
  TO public
  WITH CHECK (true);

-- Un utilisateur connecté peut voir ses propres demandes
CREATE POLICY "Users can view their own service inquiries"
  ON public.service_inquiries FOR SELECT
  USING (auth.uid() = user_id);

-- Les admins ont accès complet
CREATE POLICY "Admins can view all service inquiries"
  ON public.service_inquiries FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service inquiries"
  ON public.service_inquiries FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service inquiries"
  ON public.service_inquiries FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Index de performance
CREATE INDEX idx_service_inquiries_user_id ON public.service_inquiries(user_id);
CREATE INDEX idx_service_inquiries_status  ON public.service_inquiries(status);

CREATE TRIGGER update_service_inquiries_updated_at
  BEFORE UPDATE ON public.service_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
