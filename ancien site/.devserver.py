#!/usr/bin/env python3
"""
🚀 Serveur de développement pour Labographie
Permet de tester le projet localement avec les chemins relatifs corrects
"""

import os
import sys
import http.server
import socketserver
import urllib.parse
from pathlib import Path

PORT = 8000
DIRECTORY = os.getcwd()

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        # Décoder le chemin
        parsed_path = urllib.parse.urlparse(self.path)
        file_path = os.path.join(DIRECTORY, parsed_path.path.lstrip('/'))
        
        # Vérifier si c'est un répertoire
        if os.path.isdir(file_path):
            if not self.path.endswith('/'):
                self.send_response(301)
                self.send_header('Location', self.path + '/')
                self.end_headers()
                return
            # Chercher index.html
            index_file = os.path.join(file_path, 'index.html')
            if os.path.exists(index_file):
                self.path = parsed_path.path.rstrip('/') + '/index.html'
        
        super().do_GET()
    
    def log_message(self, format, *args):
        # Logging personnalisé
        if '200' in str(args):
            print(f"✅ {args[0]}")
        elif '404' in str(args):
            print(f"❌ {args[0]} - Fichier non trouvé")
        else:
            print(f"ℹ️  {args[0]}")

if __name__ == '__main__':
    # Créer le serveur
    handler = CustomHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"""
╔══════════════════════════════════════════════════════════════╗
║          🎨 LABOGRAPHIE - SERVEUR DE DÉVELOPPEMENT           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Serveur actif sur: http://localhost:{PORT}                     ║
║  Répertoire: {DIRECTORY}
║                                                              ║
║  Accès aux pages:                                            ║
║  • Accueil:     http://localhost:{PORT}/                       ║
║  • Services:    http://localhost:{PORT}/services.html          ║
║  • Formations:  http://localhost:{PORT}/formations.html        ║
║  • Portfolio:   http://localhost:{PORT}/portfolio.html         ║
║                                                              ║
║  Appuyez sur Ctrl+C pour arrêter le serveur                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
""")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n�� Serveur arrêté.")
            sys.exit(0)
