#!/bin/bash
# 🚀 Script de démarrage rapide pour Labographie

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          🎨 LABOGRAPHIE - DÉMARRAGE DU SERVEUR               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Déterminer le répertoire du script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé"
    exit 1
fi

# Trouver un port disponible
PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do
    PORT=$((PORT + 1))
done

echo "📂 Répertoire: $SCRIPT_DIR"
echo "🌐 URL: http://localhost:$PORT"
echo ""
echo "Pages accessibles:"
echo "  • Accueil:     http://localhost:$PORT/index.html"
echo "  • Services:    http://localhost:$PORT/services.html"
echo "  • Formations:  http://localhost:$PORT/formations.html"
echo "  • Portfolio:   http://localhost:$PORT/portfolio.html"
echo ""
echo "📝 Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Lancer le serveur
python3 -m http.server $PORT --directory "$SCRIPT_DIR" 2>/dev/null
