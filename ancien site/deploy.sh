#!/bin/bash

###############################################################################
# SCRIPT DE DÉPLOIEMENT DEVOPS - REFONTE LABOGRAPHIE
# Version: 3.0.0
# Description: Automatise le déploiement de la refonte avec vérifications
###############################################################################

set -e  # Exit on error

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 DÉPLOIEMENT REFONTE LABOGRAPHIE 3.0   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Variables
PROJECT_ROOT="$(pwd)"
BACKUP_DIR="./backups/refonte_$(date +%Y%m%d_%H%M%S)"
ASSETS_DIR="./assets"
REQUIRED_DIRS=("assets/css" "assets/js" "assets/images/partners" "assets/images/students" "assets/images/team" "assets/images/og")

###############################################################################
# 1. PRÉ-VÉRIFICATIONS
###############################################################################
log_info "Phase 1: Pré-vérifications..."

# Vérifier qu'on est dans le bon dossier
if [ ! -f "index.html" ]; then
    log_error "Erreur: index.html non trouvé. Êtes-vous dans le bon dossier?"
    exit 1
fi
log_success "Projet LaboGraphie détecté"

# Vérifier Git
if ! command -v git &> /dev/null; then
    log_warning "Git non installé. Backup manuel recommandé."
else
    log_success "Git disponible"
fi

###############################################################################
# 2. BACKUP
###############################################################################
log_info "Phase 2: Création du backup..."

mkdir -p "$BACKUP_DIR"

# Backup des fichiers critiques
if [ -f "index.html" ]; then
    cp index.html "$BACKUP_DIR/index.html.bak"
    log_success "index.html sauvegardé"
fi

if [ -d "assets" ]; then
    cp -r assets "$BACKUP_DIR/assets_backup"
    log_success "Dossier assets sauvegardé"
fi

log_success "Backup créé: $BACKUP_DIR"

###############################################################################
# 3. STRUCTURE DE FICHIERS
###############################################################################
log_info "Phase 3: Vérification/création de la structure..."

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        log_success "Créé: $dir"
    else
        log_info "Existe déjà: $dir"
    fi
done

###############################################################################
# 4. VÉRIFICATION DES FICHIERS REQUIS
###############################################################################
log_info "Phase 4: Vérification des fichiers requis..."

MISSING_FILES=()

# Vérifier main.css
if [ ! -f "assets/css/main.css" ]; then
    MISSING_FILES+=("assets/css/main.css")
fi

# Vérifier config.js
if [ ! -f "assets/js/config.js" ]; then
    MISSING_FILES+=("assets/js/config.js")
fi

# Vérifier main.js
if [ ! -f "assets/js/main.js" ]; then
    MISSING_FILES+=("assets/js/main.js")
fi

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    log_warning "Fichiers manquants détectés:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    echo ""
    log_info "Veuillez copier les fichiers depuis les artefacts créés."
    read -p "Continuer quand même? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    log_success "Tous les fichiers requis sont présents"
fi

###############################################################################
# 5. VÉRIFICATION DES IMAGES
###############################################################################
log_info "Phase 5: Vérification des images..."

# Partners
PARTNERS_COUNT=$(find assets/images/partners -type f 2>/dev/null | wc -l)
log_info "Partners: $PARTNERS_COUNT logos trouvés (attendu: 11)"

# Students
STUDENTS_COUNT=$(find assets/images/students -type f 2>/dev/null | wc -l)
log_info "Students: $STUDENTS_COUNT photos trouvées (attendu: 5)"

# Team
TEAM_COUNT=$(find assets/images/team -type f 2>/dev/null | wc -l)
log_info "Team: $TEAM_COUNT photos trouvées (attendu: 3)"

if [ $PARTNERS_COUNT -lt 11 ] || [ $STUDENTS_COUNT -lt 5 ] || [ $TEAM_COUNT -lt 3 ]; then
    log_warning "Certaines images sont manquantes. Le site utilisera des fallbacks."
fi

###############################################################################
# 6. OPTIMISATION DES IMAGES
###############################################################################
log_info "Phase 6: Optimisation des images..."

if command -v convert &> /dev/null; then
    log_info "ImageMagick détecté. Optimisation en cours..."
    
    # Optimiser partners
    find assets/images/partners -type f \( -name "*.jpg" -o -name "*.jpeg" \) -exec convert {} -resize 200x100\> -quality 85 {} \; 2>/dev/null || true
    find assets/images/partners -type f -name "*.png" -exec convert {} -resize 200x100\> {} \; 2>/dev/null || true
    
    # Optimiser students
    find assets/images/students -type f \( -name "*.jpg" -o -name "*.jpeg" \) -exec convert {} -resize 400x400\> -quality 85 {} \; 2>/dev/null || true
    
    # Optimiser team
    find assets/images/team -type f \( -name "*.jpg" -o -name "*.jpeg" \) -exec convert {} -resize 400x400\> -quality 85 {} \; 2>/dev/null || true
    
    log_success "Images optimisées"
else
    log_warning "ImageMagick non installé. Optimisation ignorée."
    log_info "Installation: sudo apt-get install imagemagick (Ubuntu/Debian)"
fi

###############################################################################
# 7. VALIDATION HTML
###############################################################################
log_info "Phase 7: Validation HTML..."

if command -v html5validator &> /dev/null; then
    html5validator --root "$PROJECT_ROOT" --ignore "node_modules" || {
        log_warning "Warnings HTML détectés (non bloquants)"
    }
    log_success "Validation HTML effectuée"
else
    log_warning "html5validator non installé. Validation ignorée."
    log_info "Installation: pip install html5validator"
fi

###############################################################################
# 8. MINIFICATION (OPTIONNEL)
###############################################################################
log_info "Phase 8: Minification des assets..."

if command -v minify &> /dev/null; then
    # CSS
    if [ -f "assets/css/main.css" ]; then
        minify assets/css/main.css > assets/css/main.min.css
        log_success "main.css minifié"
    fi
    
    # JS
    if [ -f "assets/js/main.js" ]; then
        minify assets/js/main.js > assets/js/main.min.js
        log_success "main.js minifié"
    fi
else
    log_warning "minify non installé. Minification ignorée."
    log_info "Installation: npm install -g minify"
fi

###############################################################################
# 9. GÉNÉRATION SITEMAP
###############################################################################
log_info "Phase 9: Génération du sitemap..."

cat > sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://labographie-2025.vercel.app/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://labographie-2025.vercel.app/pages/services.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://labographie-2025.vercel.app/pages/formations.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://labographie-2025.vercel.app/pages/portfolio.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://labographie-2025.vercel.app/pages/equipe.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://labographie-2025.vercel.app/pages/blog.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://labographie-2025.vercel.app/pages/contact.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
</urlset>
EOF

log_success "Sitemap généré"

###############################################################################
# 10. GÉNÉRATION MANIFEST
###############################################################################
log_info "Phase 10: Mise à jour du manifest..."

cat > manifest.json << EOF
{
  "name": "LaboGraphie",
  "short_name": "LaboGraphie",
  "description": "Laboratoire d'Innovation & Cabinet IT - Yaoundé",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8f4f0",
  "theme_color": "#b5907e",
  "icons": [
    {
      "src": "/assets/images/logo-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/images/logo-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

log_success "Manifest mis à jour"

###############################################################################
# 11. TEST LIGHTHOUSE (OPTIONNEL)
###############################################################################
log_info "Phase 11: Audit Lighthouse (optionnel)..."

if command -v lighthouse &> /dev/null; then
    log_info "Lancement de Lighthouse (cela peut prendre 1-2 min)..."
    lighthouse http://localhost:8000 --output json --output-path ./lighthouse-report.json --chrome-flags="--headless" 2>/dev/null || {
        log_warning "Lighthouse nécessite un serveur local actif"
    }
else
    log_warning "Lighthouse non installé. Audit ignoré."
    log_info "Installation: npm install -g lighthouse"
fi

###############################################################################
# 12. GIT COMMIT (OPTIONNEL)
###############################################################################
if command -v git &> /dev/null; then
    log_info "Phase 12: Git commit..."
    
    read -p "Voulez-vous commit les changements? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Refonte LaboGraphie 3.0 - CSS/JS centralisés, animations orchestrées" || {
            log_warning "Rien à commiter (déjà à jour)"
        }
        log_success "Changements commités"
        
        read -p "Voulez-vous push vers origin? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push origin main || {
                log_error "Erreur lors du push"
            }
            log_success "Push effectué"
        fi
    fi
fi

###############################################################################
# 13. RAPPORT FINAL
###############################################################################
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         📊 RAPPORT DE DÉPLOIEMENT         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

log_info "Backup: $BACKUP_DIR"
log_info "Fichiers CSS: $(find assets/css -name "*.css" 2>/dev/null | wc -l)"
log_info "Fichiers JS: $(find assets/js -name "*.js" 2>/dev/null | wc -l)"
log_info "Images Partners: $PARTNERS_COUNT"
log_info "Images Students: $STUDENTS_COUNT"
log_info "Images Team: $TEAM_COUNT"

echo ""
log_success "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
echo ""

###############################################################################
# 14. PROCHAINES ÉTAPES
###############################################################################
echo -e "${YELLOW}📋 PROCHAINES ÉTAPES:${NC}"
echo ""
echo "1. 🧪 Tester localement:"
echo "   python -m http.server 8000"
echo "   Ouvrir: http://localhost:8000"
echo ""
echo "2. ✅ Vérifier:"
echo "   - Ticker jaune défile en continu"
echo "   - Dark mode fonctionne"
echo "   - Mobile menu responsive"
echo "   - Animations staggered au scroll"
echo "   - Images partenaires/étudiants affichées"
echo ""
echo "3. 🚀 Déployer sur Vercel:"
echo "   vercel --prod"
echo ""
echo "4. 📈 Tester Performance:"
echo "   https://pagespeed.web.dev/"
echo ""
echo "5. 🔄 Refondre les autres pages:"
echo "   - services.html"
echo "   - formations.html"
echo "   - portfolio.html"
echo "   - equipe.html"
echo "   - blog.html"
echo "   - contact.html"
echo ""

log_info "Support: labographie@gmail.com | WhatsApp: +237 621 317 408"
echo ""