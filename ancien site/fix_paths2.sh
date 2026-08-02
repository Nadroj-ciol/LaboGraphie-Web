#!/bin/bash

# Traiter les liens internes avec fragments (#)
for file in *.html; do
    if [ -f "$file" ]; then
        sed -i 's|href="/services.html#|href="services.html#|g' "$file"
        sed -i 's|href="/formations.html#|href="formations.html#|g' "$file"
        sed -i 's|href="/portfolio.html#|href="portfolio.html#|g' "$file"
        sed -i 's|href="/mentions-legales.html"|href="mentions-legales.html"|g' "$file"
        sed -i 's|href="/confidentialite.html"|href="confidentialite.html"|g' "$file"
        sed -i 's|href="/cookies.html"|href="cookies.html"|g' "$file"
    fi
done

echo "✅ Tous les chemins ont été convertis"
