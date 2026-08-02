# LaboGraphie Web

Bienvenue sur le dépôt du projet Web de LaboGraphie, le laboratoire d'innovation et cabinet informatique basé à Yaoundé.

## Technologies utilisées
- **Frontend** : React 18, Vite, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **Gestion d'état & Fetching** : TanStack React Query
- **Backend & Base de données** : Supabase

## Prérequis
- Node.js & npm

## Installation
1. Clonez le dépôt
2. Installez les dépendances :
   ```sh
   npm install
   ```
3. Configurez vos variables d'environnement (copiez `.env.example` vers `.env.local` et remplissez vos clés Supabase).
4. Lancez le serveur de développement :
   ```sh
   npm run dev
   ```

## Base de données
Les migrations SQL se trouvent dans `supabase/migrations`. 
Pour initialiser votre base de données distante :
```sh
npx supabase link --project-ref <votre-reference-projet>
npx supabase db push
```
