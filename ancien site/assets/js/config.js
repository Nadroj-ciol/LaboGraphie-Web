
/**
 * Labographie - Configuration
 * Version moderne inspirée de digital-college.fr
 */

(function() {
    'use strict';
    
    const CONFIG = {
        // Version
        version: '3.0.0',
        buildDate: '2024-12-30',
        
        // Environnement
        environment: {
            isDevelopment: window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1',
            isProduction: window.location.hostname.includes('labographie'),
            isStaging: window.location.hostname.includes('vercel.app')
        },
        
        // Contact
        contact: {
            phone: '+237 621 317 408',
            phoneRaw: '237621317408',
            whatsapp: 'https://wa.me/237621317408',
            email: 'labographie@gmail.com',
            address: {
                street: 'Bastos',
                city: 'Yaoundé',
                country: 'Cameroun',
                coordinates: {
                    lat: 3.8480,
                    lng: 11.5021
                }
            },
            hours: {
                weekdays: 'Lundi - Samedi: 8h - 18h',
                weekend: 'Dimanche: Fermé'
            }
        },
        
        // Réseaux sociaux
        social: {
            facebook: 'https://facebook.com/labographie',
            instagram: 'https://instagram.com/labographie',
            linkedin: 'https://linkedin.com/company/labographie',
            twitter: 'https://twitter.com/labographie',
            youtube: 'https://youtube.com/@labographie',
            behance: 'https://behance.net/labographie'
        },
        
        // Services
        services: {
            design: {
                name: 'Design Graphique',
                icon: 'fa-palette',
                color: '#7c3aed',
                items: [
                    'Identité visuelle',
                    'UI/UX Design',
                    'Motion Design',
                    'Design 3D'
                ]
            },
            development: {
                name: 'Développement Web',
                icon: 'fa-code',
                color: '#0a66c2',
                items: [
                    'Sites vitrines',
                    'E-commerce',
                    'Applications web',
                    'Applications mobiles'
                ]
            },
            formation: {
                name: 'Formations IT',
                icon: 'fa-graduation-cap',
                color: '#f97316',
                items: [
                    'Design Graphique',
                    'Développement Web',
                    'Maintenance IT',
                    'Marketing Digital'
                ]
            },
            infrastructure: {
                name: 'Infrastructure IT',
                icon: 'fa-server',
                color: '#10b981',
                items: [
                    'Réseaux informatiques',
                    'Sécurité des systèmes',
                    'Maintenance préventive',
                    'Support technique'
                ]
            }
        },
        
        // Formations
        formations: [
            {
                id: 'design',
                name: 'Design Graphique',
                duration: '3 mois',
                price: 250000,
                currency: 'FCFA',
                features: [
                    'Adobe Creative Suite',
                    'Figma & Sketch',
                    'Motion Design',
                    'Portfolio professionnel'
                ]
            },
            {
                id: 'web-dev',
                name: 'Développement Web',
                duration: '4 mois',
                price: 350000,
                currency: 'FCFA',
                features: [
                    'HTML/CSS/JavaScript',
                    'React & Vue.js',
                    'Node.js & Express',
                    'Base de données'
                ]
            },
            {
                id: 'maintenance',
                name: 'Maintenance IT',
                duration: '3 mois',
                price: 300000,
                currency: 'FCFA',
                features: [
                    'Réseaux informatiques',
                    'Sécurité des systèmes',
                    'Diagnostic & réparation',
                    'Certification'
                ]
            }
        ],
        
        // Équipe
        team: [
            {
                id: 'jordan',
                name: 'NDE Jordan Loic',
                role: 'CEO, DevOps, Maintenancier',
                expertise: ['DevOps', 'Design', 'Infrastructure', 'Leadership'],
                social: {
                    linkedin: '#',
                    behance: '#'
                }
            },
            {
                id: 'yvana',
                name: 'NONO NOUTCHANG Yvana',
                role: 'DevOps, Design',
                expertise: ['CI/CD', 'UI/UX', 'Infrastructure', 'Automation'],
                social: {
                    linkedin: '#',
                    dribbble: '#'
                }
            },
            {
                id: 'brinda',
                name: 'FUNGA BIADJEU Brinda',
                role: 'DevOps, Marketing, Data Scientist',
                expertise: ['Data Science', 'Marketing', 'Automation', 'Analytics'],
                social: {
                    linkedin: '#',
                    github: '#'
                }
            }
        ],
        
        // Statistiques
        stats: {
            projects: 200,
            clients: 50,
            years: 8,
            satisfaction: 98,
            students: 150
        },
        
        // API Configuration
        api: {
            baseURL: 'https://api.labographie.com',
            endpoints: {
                contact: '/contact',
                newsletter: '/newsletter',
                quote: '/quote'
            }
        },
        
        // Analytics
        analytics: {
            googleAnalytics: 'G-XXXXXXXXXX',
            facebookPixel: '',
            hotjar: ''
        },
        
        // Features
        features: {
            darkMode: true,
            animations: true,
            serviceWorker: true,
            newsletter: true,
            blog: true,
            chat: false
        },
        
        // Messages
        messages: {
            fr: {
                loading: 'Chargement...',
                success: 'Succès !',
                error: 'Une erreur est survenue',
                formSuccess: 'Message envoyé avec succès !',
                formError: 'Erreur lors de l\'envoi',
                contactUs: 'Contactez-nous',
                learnMore: 'En savoir plus'
            }
        }
    };
    
    // Méthodes utilitaires
    CONFIG.utils = {
        formatPhone: function(phone) {
            return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
        },
        
        formatPrice: function(price) {
            return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
        },
        
        getMessage: function(key) {
            return this.messages.fr[key] || key;
        },
        
        log: function(...args) {
            if (this.environment.isDevelopment) {
                console.log('[Labographie]', ...args);
            }
        }
    };
    
    // Exposer la configuration globale
    window.LaboGraphieConfig = CONFIG;
    
    // Événement de chargement
    document.dispatchEvent(new CustomEvent('labographie:config:loaded', {
        detail: CONFIG
    }));
    
    // Log de développement
    if (CONFIG.environment.isDevelopment) {
        console.log('%c⚙️ Labographie Config', 'font-size: 16px; font-weight: bold; color: #0a66c2');
        console.log('Version:', CONFIG.version);
        console.log('Environment:', CONFIG.environment.isDevelopment ? 'Development' : 'Production');
    }
})();
