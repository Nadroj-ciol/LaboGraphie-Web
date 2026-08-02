# 🚀 GUIDE DE DÉMARRAGE RAPIDE - LABOGRAPHIE

## ⚡ Démarrer en 30 secondes

### 1️⃣ Ouvrir le terminal
```bash
cd "/home/affirmatif/Documents/LaboGraphie Web"
```

### 2️⃣ Lancer le serveur
```bash
python3 .devserver.py
```

### 3️⃣ Ouvrir dans le navigateur
Cliquez sur: **http://localhost:8000**

---

## 📖 Qu'est-ce qui a changé?

### ✅ Problèmes résolus:
1. **portfolio.html** - Fichier vide → Contenu complet créé
2. **Chemins CSS/JS** - Chemins absolus → Chemins relatifs
3. **Navigation** - Cassée → Cohérente et fonctionnelle
4. **Serveur** - Absent → Serveur Python fourni

### 📂 Structure finale:
```
LaboGraphie Web/
├── index.html              ✅ Accueil
├── portfolio.html          ✅ Portfolio (NOUVEAU)
├── services.html           ✅ Services
├── formations.html         ✅ Formations
├── .devserver.py           ✅ Serveur local
├── AUDIT_REFONTE.md        ✅ Rapport complet
├── assets/
│   ├── css/
│   │   ├── global.css
│   │   ├── home.css
│   │   └── pages/
│   │       ├── portfolio.css
│   │       ├── services.css
│   │       └── formations.css
│   └── js/
│       ├── main.js
│       ├── config.js
│       └── pages/
│           ├── formations.js
│           └── services.js
```

---

## 🧪 Tests recommandés

### 1. Navigation
- [ ] Cliquer sur "Accueil" → Retourner à index.html
- [ ] Cliquer sur "Services" → Page services.html charge
- [ ] Cliquer sur "Formations" → Page formations.html charge
- [ ] Cliquer sur "Portfolio" → Page portfolio.html charge

### 2. Styles & JavaScript
- [ ] La page a une mise en forme (pas de texte brut)
- [ ] Les couleurs s'affichent correctement
- [ ] Les animations de scroll fonctionnent
- [ ] Le menu mobile fonctionne

### 3. Portfolio spécifiquement
- [ ] Les 6 projets s'affichent
- [ ] Les stats (200, 98%, 15, 8) sont animées
- [ ] Les boutons fonctionnent
- [ ] Les filtres réagissent au survol

---

## 🔗 URLs de test

| Page | URL |
|------|-----|
| Accueil | http://localhost:8000/index.html |
| Services | http://localhost:8000/services.html |
| Formations | http://localhost:8000/formations.html |
| **Portfolio** | http://localhost:8000/portfolio.html |

---

## ⚙️ Configuration du serveur

### Port par défaut: `8000`

Pour utiliser un autre port, modifiez `.devserver.py`:
```python
PORT = 8080  # Changer 8000 en 8080
```

Puis relancez:
```bash
python3 .devserver.py
```

---

## 🎨 Personnalisation

Tous les chemins étant maintenant **relatifs**, vous pouvez:

1. ✅ **Développer localement** - Fonctionne sans serveur (mais avec limitation CSS)
2. ✅ **Tester avec serveur** - Fonctionne complètement
3. ✅ **Déployer facilement** - Sur n'importe quel serveur web

---

## 📞 Support

### Si CSS/JS ne s'appliquent pas:
```bash
# Vérifier que le serveur tourne
curl http://localhost:8000
# Devrait afficher du HTML
```

### Si une page ne charge pas:
```bash
# Vérifier les fichiers existent
ls -la *.html
# Tous les fichiers doivent être listés
```

### Si le serveur ne démarre pas:
```bash
# Vérifier le port
lsof -i :8000

# Si le port est occupé, utilisez:
python3 .devserver.py --port 8001
```

---

## 🎯 Prochaines étapes

1. Créer le dossier `assets/images/` avec les images du portfolio
2. Créer les pages manquantes (equipe.html, contact.html, etc.)
3. Ajouter le blog et les ressources
4. Tester la performance
5. Déployer en production

---

**Version:** 1.0  
**Date:** 2 janvier 2026  
**Statut:** ✅ Prêt à l'emploi
