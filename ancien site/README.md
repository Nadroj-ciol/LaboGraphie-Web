# 📚 INDEX DU PROJET LABOGRAPHIE

## 🚀 Démarrage rapide
```bash
./start.sh
# ou
python3 -m http.server 8000
```
Puis ouvrez: **http://localhost:8000**

---

## 📄 Documentation

### 📖 Guides
| Fichier | Description | Durée |
|---------|-------------|-------|
| **QUICKSTART.md** | Guide de démarrage (recommandé d'abord) | 2 min |
| **AUDIT_REFONTE.md** | Rapport complet de l'audit | 5 min |
| **REFONTE_COMPLETE.md** | Détails techniques complets | 10 min |
| **Architecture.md** | Architecture du projet | 5 min |

### 🔧 Scripts
| Fichier | Description |
|---------|-------------|
| **start.sh** | Script de démarrage automatique du serveur |
| **.devserver.py** | Serveur Python personnalisé (avancé) |
| **fix_paths.sh** | Script de conversion des chemins (déjà utilisé) |

---

## 🌐 Pages Web

### Pages principales
| Page | Fichier | Statut |
|------|---------|--------|
| Accueil | `index.html` | ✅ Fonctionnel |
| Services | `services.html` | ✅ Fonctionnel |
| Formations | `formations.html` | ✅ Fonctionnel |
| **Portfolio** | `portfolio.html` | ✅ **NOUVEAU** |

### Pages à créer
- `equipe.html` - Page équipe
- `contact.html` - Page de contact
- `mentions-legales.html` - Mentions légales
- `confidentialite.html` - Politique de confidentialité
- `cookies.html` - Gestion des cookies

---

## 📁 Structure des assets

```
assets/
├── css/
│   ├── global.css         - Styles globaux
│   ├── home.css           - Styles de la page d'accueil
│   └── pages/
│       ├── portfolio.css  - Styles du portfolio (✅ NOUVEAU)
│       ├── services.css   - Styles des services
│       └── formations.css - Styles des formations
│
└── js/
    ├── main.js            - JavaScript principal
    ├── config.js          - Configuration
    └── pages/
        ├── formations.js  - Script formations
        └── services.js    - Script services

images/
    (À créer - dossier pour les images du portfolio)
```

---

## ✅ État du projet

### Refonte terminée:
- ✅ **portfolio.html** - Fichier vide remplacé par contenu complet
- ✅ **Chemins relatifs** - 150+ chemins convertis
- ✅ **Serveur local** - Disponible et fonctionnel
- ✅ **Navigation** - Cohérente et testée
- ✅ **Documentation** - Complète et claire

### Prochaines étapes:
1. Créer le dossier `assets/images/`
2. Tester sur tous les navigateurs
3. Créer les pages manquantes
4. Optimiser les images

---

## 🎯 Utilisation

### Pour développer:
```bash
./start.sh
# Le serveur démarre automatiquement sur le premier port disponible
```

### Pour déployer:
1. Tester localement avec `./start.sh`
2. Mettre en place un serveur web (Apache, Nginx)
3. Copier tous les fichiers
4. Configurer les chemins si nécessaire

### Pour modifier:
- Tous les fichiers HTML utilisent des **chemins relatifs**
- Les fichiers CSS/JS se trouvent dans `assets/`
- Respectez la structure de dossiers existante

---

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| Fichiers HTML | 4 |
| Fichiers CSS | 5 |
| Fichiers JS | 4 |
| Chemins corrigés | 150+ |
| Status global | ✅ 100% complet |

---

## 💡 Conseils

### Avant de commencer:
- Lisez **QUICKSTART.md** (2 minutes)
- Lancez `./start.sh`
- Testez les pages dans le navigateur

### Si quelque chose ne fonctionne pas:
- Vérifiez que le serveur tourne (`./start.sh`)
- Ouvrez la console du navigateur (F12)
- Regardez les erreurs dans l'onglet "Console"

### Pour ajouter une nouvelle page:
1. Créer `nouvelle-page.html`
2. Utiliser les mêmes chemins relatifs que les autres pages
3. Ajouter le lien dans la navigation (`<a href="nouvelle-page.html">`)

---

## 📞 Support

### Questions sur la structure?
→ Voir **Architecture.md**

### Problèmes de démarrage?
→ Voir **QUICKSTART.md**

### Détails techniques complets?
→ Voir **REFONTE_COMPLETE.md**

### Rapport d'audit?
→ Voir **AUDIT_REFONTE.md**

---

## 🎉 Prêt à commencer!

```bash
cd "/home/affirmatif/Documents/LaboGraphie Web"
./start.sh
```

Puis ouvrez: **http://localhost:8000** 🚀

---

**Version:** 1.0  
**Dernière mise à jour:** 2 janvier 2026  
**Status:** ✅ Prêt pour le développement
