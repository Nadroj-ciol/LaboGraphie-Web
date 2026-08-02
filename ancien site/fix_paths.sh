#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔧 Conversion des chemins absolus en chemins relatifs...${NC}\n"

# Fonction pour remplacer les chemins dans les fichiers
fix_file() {
    local file=$1
    echo -e "${YELLOW}  Traitement: $file${NC}"
    
    # Remplacer /assets/ par assets/
    sed -i 's|href="/assets/|href="assets/|g' "$file"
    sed -i 's|src="/assets/|src="assets/|g' "$file"
    
    # Remplacer les liens internes absolus
    sed -i 's|href="/index.html"|href="index.html"|g' "$file"
    sed -i 's|href="/services.html"|href="services.html"|g' "$file"
    sed -i 's|href="/formations.html"|href="formations.html"|g' "$file"
    sed -i 's|href="/portfolio.html"|href="portfolio.html"|g' "$file"
    sed -i 's|href="/equipe.html"|href="equipe.html"|g' "$file"
    sed -i 's|href="/contact.html"|href="contact.html"|g' "$file"
    
    # Remplacer href="/" par href="index.html" (lien home)
    sed -i 's|href="\/$"|href="index.html"|g' "$file"
    sed -i 's|href="/" |href="index.html" |g' "$file"
    
    echo -e "${GREEN}  ✓ Réussi${NC}"
}

# Traiter tous les fichiers HTML
for file in *.html; do
    if [ -f "$file" ]; then
        fix_file "$file"
    fi
done

echo -e "\n${GREEN}✅ Conversion terminée!${NC}"
echo -e "${YELLOW}📊 Vérification des chemins restants:${NC}"
grep -r 'href="/' *.html | head -5 || echo -e "${GREEN}Aucun chemin absus restant${NC}"
