
/**
 * Formations Page JavaScript
 * Gestion spécifique à la page formations.html
 */

class FormationsPage {
    constructor() {
        this.programs = [];
        this.init();
    }

    init() {
        this.loadPrograms();
        this.initFilters();
        this.initProgramCards();
        this.initInscriptionForms();
        this.initTestimonialsSlider();
        this.initScrollAnimations();
        this.initContactForms();
    }

    // Charger les programmes
    loadPrograms() {
        // Simulation de données - À remplacer par une API réelle
        this.programs = [
            {
                id: 'design',
                title: 'Design Graphique Professionnel',
                category: 'design',
                duration: '3 mois',
                level: 'Débutant à Avancé',
                location: 'Yaoundé & En ligne',
                price: 250000,
                description: 'Maîtrisez les outils et techniques du design graphique moderne.',
                features: [
                    'Adobe Creative Suite complète',
                    'UI/UX Design et prototypage',
                    'Motion Design avec After Effects',
                    'Portfolio professionnel inclus'
                ],
                badge: 'Populaire'
            },
            {
                id: 'dev',
                title: 'Développement Web Full Stack',
                category: 'developpement',
                duration: '4 mois',
                level: 'Débutant à Intermédiaire',
                location: 'Yaoundé',
                price: 350000,
                description: 'Devenez développeur full stack en maîtrisant frontend et backend.',
                features: [
                    'HTML5, CSS3, JavaScript ES6+',
                    'React, Vue.js, Node.js',
                    'Bases de données MongoDB & SQL',
                    'Déploiement et DevOps de base'
                ],
                badge: 'Nouveau'
            },
            {
                id: 'it',
                title: 'Maintenance & Infrastructure IT',
                category: 'infrastructure',
                duration: '3 mois',
                level: 'Débutant',
                location: 'Yaoundé',
                price: 300000,
                description: 'Apprenez à installer, configurer et maintenir les infrastructures informatiques.',
                features: [
                    'Réflex informatiques (LAN/WAN)',
                    'Maintenance hardware & software',
                    'Sécurité des systèmes',
                    'Virtualisation et cloud computing'
                ]
            },
            {
                id: 'marketing',
                title: 'Marketing Digital & Social Media',
                category: 'marketing',
                duration: '2 mois',
                level: 'Tous niveaux',
                location: 'En ligne',
                price: 200000,
                description: 'Maîtrisez les stratégies de marketing digital et la gestion des réseaux sociaux.',
                features: [
                    'Stratégie réseaux sociaux',
                    'Publicité Facebook/Instagram Ads',
                    'SEO et content marketing',
                    'Analytics et mesure de performance'
                ],
                badge: 'Prochainement'
            }
        ];
    }

    // Filtres des formations
    initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const programCards = document.querySelectorAll('.program-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Mettre à jour les boutons actifs
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                // Filtrer les cartes
                programCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = '';
                        this.animateCard(card);
                    } else {
                        const category = card.getAttribute('data-category');
                        if (category === filter) {
                            card.style.display = '';
                            this.animateCard(card);
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });

                // Mettre à jour le compteur
                this.updateProgramCount(filter);
            });
        });

        // Initialiser le compteur
        this.updateProgramCount('all');
    }

    updateProgramCount(filter) {
        const count = filter === 'all' 
            ? this.programs.length 
            : this.programs.filter(p => p.category === filter).length;
        
        const activeButton = document.querySelector('.filter-btn.active');
        if (activeButton) {
            const countElement = activeButton.querySelector('.filter-count');
            if (countElement) {
                countElement.textContent = count;
                
                // Animation du compteur
                this.animateCounter(countElement, count);
            }
        }
    }

    animateCounter(element, target) {
        const current = parseInt(element.textContent);
        const difference = target - current;
        const step = Math.sign(difference);
        
        let count = current;
        const interval = setInterval(() => {
            count += step;
            element.textContent = count;
            
            if (count === target) {
                clearInterval(interval);
            }
        }, 50);
    }

    // Animation des cartes
    initProgramCards() {
        const cards = document.querySelectorAll('.program-card');

        cards.forEach(card => {
            // Animation au hover
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = 'var(--shadow-xl)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'var(--shadow-md)';
            });

            // Animation au clic
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a') && !e.target.closest('button')) {
                    const programId = card.getAttribute('data-category');
                    this.showProgramDetails(programId);
                }
            });
        });
    }

    animateCard(card) {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease-out';
        }, 10);
    }

    // Détails d'un programme
    showProgramDetails(programId) {
        const program = this.programs.find(p => p.category === programId);
        if (!program) return;

        // Créer une modal ou rediriger vers une page détaillée
        console.log(`Voir détails: ${program.title}`);
        
        // Ici vous pouvez implémenter une modal détaillée
        // Pour l'instant, scroll vers la section d'inscription
        const inscriptionSection = document.getElementById('inscription');
        if (inscriptionSection) {
            inscriptionSection.scrollIntoView({ behavior: 'smooth' });
            
            // Pré-remplir le formulaire d'inscription
            this.prefillInscriptionForm(program);
        }
    }

    // Pré-remplir le formulaire d'inscription
    prefillInscriptionForm(program) {
        const form = document.querySelector('form[data-inscription]');
        if (!form) return;

        const programField = form.querySelector('[name="program"]');
        if (programField) {
            programField.value = program.title;
        }
    }

    // Formulaires d'inscription
    initInscriptionForms() {
        const forms = document.querySelectorAll('form[data-inscription]');
        
        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitInscriptionForm(form);
            });
        });

        // Boutons d'inscription directs
        const inscriptionButtons = document.querySelectorAll('.program-actions .btn-primary');
        inscriptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.getAttribute('href') === '#inscription') {
                    e.preventDefault();
                    const programCard = button.closest('.program-card');
                    const programId = programCard.getAttribute('data-category');
                    
                    this.scrollToInscription();
                    this.prefillInscriptionFormById(programId);
                }
            });
        });
    }

    prefillInscriptionFormById(programId) {
        const program = this.programs.find(p => p.category === programId);
        if (program) {
            this.prefillInscriptionForm(program);
        }
    }

    async submitInscriptionForm(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Afficher l'état de chargement
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        try {
            // Récupérer les données du formulaire
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulation d'envoi (à remplacer par une API réelle)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Succès
            this.showNotification(
                'Votre demande d\'inscription a été envoyée avec succès ! ' +
                'Nous vous contacterons sous 24h pour finaliser votre inscription.',
                'success'
            );
            
            // Réinitialiser le formulaire
            form.reset();
            
            // Scroll vers un message de confirmation
            setTimeout(() => {
                const confirmation = document.getElementById('confirmation-inscription');
                if (confirmation) {
                    confirmation.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
            
        } catch (error) {
            // Erreur
            this.showNotification(
                'Erreur lors de l\'envoi de votre demande. Veuillez réessayer ou nous contacter directement.',
                'error'
            );
            console.error('Form error:', error);
            
        } finally {
            // Restaurer le bouton
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // Slider des témoignages
    initTestimonialsSlider() {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;

        // Données des témoignages
        const testimonials = [
            {
                id: 1,
                quote: "La formation en développement web m'a permis de changer complètement de carrière. En 4 mois, j'ai acquis des compétences solides et j'ai trouvé un emploi avant même la fin de la formation.",
                author: "Marceline Awono",
                program: "Développeuse Frontend chez Tech Solutions",
                initials: "MA"
            },
            {
                id: 2,
                quote: "Excellente formation en design graphique ! Les formateurs sont des professionnels en activité qui nous transmettent leur savoir-faire concret. Mon portfolio a séduit plusieurs agences.",
                author: "Kevin Djoufack",
                program: "Designer UI/UX chez Creative Agency",
                initials: "KD"
            },
            {
                id: 3,
                quote: "Après la formation en maintenance IT, j'ai immédiatement trouvé un poste de technicien réseau. La partie pratique est très complète et correspond parfaitement aux besoins des entreprises.",
                author: "Sarah Ngo",
                program: "Technicienne réseau chez Digital Solutions",
                initials: "SN"
            }
        ];

        // Fonction pour créer un slide
        const createSlide = (testimonial) => `
            <div class="testimonial-slide">
                <p class="testimonial-quote">${testimonial.quote}</p>
                <div class="testimonial-author">
                    <div class="author-avatar">${testimonial.initials}</div>
                    <div class="author-info">
                        <div class="author-name">${testimonial.author}</div>
                        <div class="author-program">${testimonial.program}</div>
                    </div>
                </div>
            </div>
        `;

        // Initialiser le slider
        let currentIndex = 0;
        
        // Afficher le premier témoignage
        slider.innerHTML = createSlide(testimonials[currentIndex]);

        // Auto-rotation des témoignages
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            
            // Animation de transition
            slider.style.opacity = '0';
            
            setTimeout(() => {
                slider.innerHTML = createSlide(testimonials[currentIndex]);
                slider.style.opacity = '1';
                slider.style.transition = 'opacity 0.5s ease';
            }, 300);
            
        }, 8000); // Change toutes les 8 secondes
    }

    // Animations au scroll
    initScrollAnimations() {
        // Animation des cartes au scroll
        const programCards = document.querySelectorAll('.program-card');
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        programCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });

        // Animation des statistiques
        const stats = document.querySelectorAll('.hero-stat');
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStat(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => statObserver.observe(stat));
    }

    animateStat(statElement) {
        const numberElement = statElement.querySelector('.stat-number');
        const target = parseInt(numberElement.getAttribute('data-count') || '0');
        
        if (target > 0) {
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    numberElement.textContent = target;
                    clearInterval(timer);
                } else {
                    numberElement.textContent = Math.floor(current);
                }
            }, 30);
        }
    }

    // Formulaires de contact
    initContactForms() {
        const contactButtons = document.querySelectorAll('[href="#inscription"]');
        
        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.getAttribute('href') === '#inscription') {
                    e.preventDefault();
                    this.scrollToInscription();
                }
            });
        });
    }

    scrollToInscription() {
        const inscriptionSection = document.getElementById('inscription');
        if (inscriptionSection) {
            inscriptionSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Notifications
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Afficher
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto-fermeture
        const autoClose = setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
        
        // Bouton de fermeture
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoClose);
            this.closeNotification(notification);
        });
    }

    closeNotification(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Méthode utilitaire pour le formatage des prix
    formatPrice(price) {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    }

    // Méthode pour obtenir les mensualités
    calculateInstallment(price, months) {
        const monthly = Math.ceil(price / months);
        return `${months} x ${this.formatPrice(monthly)}`;
    }
}

// Initialiser la page quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.FormationsPage = new FormationsPage();
    
    // Intégration avec le script principal
    if (window.LaboGraphie) {
        window.LaboGraphie.updateActiveNavLink();
    }
});

// Exporter pour utilisation globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormationsPage;
}
