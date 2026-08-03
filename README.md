# 🚀 LaboGraphie Web Application

Bienvenue sur le dépôt officiel du projet web de **LaboGraphie**, un laboratoire d'innovation et cabinet informatique de premier plan basé à Yaoundé, au Cameroun. 

Ce projet comprend un site vitrine moderne et interactif pour présenter les services de l'entreprise (Design & Branding, Marketing Digital, Cyber-sécurité, etc.), ainsi qu'un **tableau de bord administrateur (CMS)** complet pour gérer le contenu dynamique tel que les articles de blog, les offres d'emploi, et les demandes de devis.

---

## ✨ Fonctionnalités Principales

### 🌐 Site Public (Vitrine)
- **Présentation des Services** : Détail des offres d'accompagnement digital.
- **Blog Intégré** : Lecture d'articles filtrables par catégorie avec fonctionnalités de partage social.
- **Demandes de Devis** : Formulaire interactif et estimateur de devis en ligne.
- **Carrières** : Consultation des offres d'emploi et soumission de candidatures.
- **Design Réactif & Animations** : Interface utilisateur premium avec Tailwind CSS et Framer Motion / animations fluides.

### 🔒 Espace Administrateur (Tableau de Bord)
- **Gestion des Articles** : Création, modification et suppression d'articles (avec éditeur de texte riche ReactQuill, filtres et moteur de recherche).
- **Gestion des Demandes** : Suivi des demandes de contact, de service et de devis.
- **Gestion des Carrières** : Publication d'offres d'emploi et suivi des candidatures.
- **Statistiques & Vue d'ensemble** : Indicateurs de performance en temps réel.

---

## 🛠️ Stack Technique

- **Frontend** : [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **UI/UX & Styling** : [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **Gestion d'état & Requêtes** : [TanStack React Query](https://tanstack.com/query/latest)
- **Routage** : React Router DOM
- **Backend & Base de données** : [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)

---

## 📂 Architecture du Projet

```text
LaboGraphie Web/
├── src/
│   ├── assets/       # Images, logos et ressources statiques
│   ├── components/   # Composants réutilisables (UI, sections globales, tableau de bord)
│   ├── data/         # Données statiques de configuration
│   ├── hooks/        # Hooks personnalisés (appels API Supabase)
│   ├── integrations/ # Configuration des services tiers (Supabase client)
│   ├── lib/          # Utilitaires (ex: fonction cn pour Tailwind)
│   └── pages/        # Pages principales (Routes) et sous-dossier dashboard/
├── supabase/
│   └── migrations/   # Fichiers SQL pour la structure de la base de données
└── public/           # Fichiers publics accessibles directement
```

---

## 🚀 Installation & Démarrage Local

### 1. Prérequis
Assurez-vous d'avoir installé sur votre machine :
- **Node.js** (v18 ou supérieur)
- **npm** ou **yarn**
- **Git**

### 2. Cloner le dépôt
```bash
git clone https://github.com/votre-utilisateur/labographie-web.git
cd "LaboGraphie Web"
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Configuration de l'environnement (Supabase)
Copiez le fichier `.env.example` (s'il existe) vers un nouveau fichier nommé `.env.local` et ajoutez vos clés API Supabase :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:8080` (ou un port similaire indiqué dans le terminal).

---

## 🗄️ Base de Données (Supabase)

Toutes les tables, politiques de sécurité (RLS) et fonctions sont versionnées dans le dossier `supabase/migrations`.

Pour initialiser votre base de données distante depuis la CLI Supabase :
```bash
npx supabase login
npx supabase link --project-ref <votre-reference-projet>
npx supabase db push
```

---

## 🤝 Contribution

Si vous faites partie de l'équipe et souhaitez contribuer :
1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`).
2. Faites vos modifications et commitez (`git commit -m "feat: ajout d'une nouvelle fonctionnalité"`).
3. Poussez votre branche (`git push origin feature/nouvelle-fonctionnalite`).
4. Ouvrez une Pull Request sur le dépôt pour révision.

---

**© 2026 LaboGraphie. Tous droits réservés.**  
*Créé avec passion pour accompagner la transformation digitale en Afrique.*
