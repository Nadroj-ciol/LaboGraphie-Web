
/**
 * Services Page JavaScript
 * Gestion spécifique à la page services.html
 */

class ServicesPage {
    constructor() {
        this.init();
    }

    init() {
        this.initServiceNavigation();
        this.initFAQAccordion();
        this.initServiceCards();
        this.initComparisonTable();
        this.initScrollAnimations();
        this.initContactForms();
    }

    // Navigation entre services
    initServiceNavigation() {
        const navLinks = document.querySelectorAll('.services-nav-link');
        const serviceSections = document.querySelectorAll('.service-category');
        const navContainer = document.querySelector('.services-nav-inner');

        // Scroll spy pour la navigation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        serviceSections.forEach(section => observer.observe(section));

        // Smooth scroll pour les liens
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 120,
                        behavior: 'smooth'
                    });

                    // Mettre à jour l'URL
                    history.pushState(null, null, targetId);
                }
            });
        });

        // Navigation horizontale avec flèches (si besoin)
        if (navContainer) {
            this.initHorizontalNavigation(navContainer);
        }
    }

    // Navigation horizontale pour les petits écrans
    initHorizontalNavigation(container) {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    }

    // FAQ Accordéon
    initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                // Fermer tous les autres items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Ouvrir/fermer cet item
                item.classList.toggle('active');
            });
        });

        // Ouvrir le premier item par défaut
        if (faqItems.length > 0) {
            faqItems[0].classList.add('active');
        }
    }

    // Animation des cartes de services
    initServiceCards() {
        const cards = document.querySelectorAll('.service-detail-card');

        cards.forEach(card => {
            // Animation au hover
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });

            // Click pour voir les détails
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    const title = card.querySelector('.service-detail-title').textContent;
                    console.log(`Voir détails pour: ${title}`);
                    // Ici vous pouvez implémenter une modal ou une navigation
                }
            });
        });
    }

    // Tableau de comparaison interactif
    initComparisonTable() {
        const table = document.querySelector('.comparison-table');
        if (!table) return;

        // Surligner les lignes au hover
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'var(--gray-50)';
            });

            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
        });

        // Animation des check/cross
        const checks = table.querySelectorAll('.check, .cross');
        checks.forEach(check => {
            check.style.opacity = '0';
            check.style.transform = 'scale(0)';

            setTimeout(() => {
                check.style.transition = 'all 0.3s ease';
                check.style.opacity = '1';
                check.style.transform = 'scale(1)';
            }, 100);
        });
    }

    // Animations au scroll
    initScrollAnimations() {
        // Animation progressive des éléments
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    elementObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            elementObserver.observe(el);
        });

        // Animation des nombres dans les prix
        const priceElements = document.querySelectorAll('.price-range');
        priceElements.forEach(price => {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    this.animatePrice(price);
                    observer.unobserve(price);
                }
            }, { threshold: 0.5 });
            
            observer.observe(price);
        });
    }

    // Animation des prix
    animatePrice(element) {
        const text = element.textContent;
        const numbers = text.match(/\d+/g);
        
        if (!numbers) return;
        
        numbers.forEach(number => {
            const target = parseInt(number);
            let current = 0;
            const increment = target / 30;
            const originalText = element.textContent;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                const newText = originalText.replace(
                    new RegExp(number, 'g'), 
                    Math.floor(current).toLocaleString('fr-FR')
                );
                element.textContent = newText;
            }, 30);
        });
    }

    // Formulaires de contact
    initContactForms() {
        const contactButtons = document.querySelectorAll('[href="#contact"]');
        
        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const href = button.getAttribute('href');
                
                if (href === '#contact') {
                    e.preventDefault();
                    this.scrollToContact();
                }
            });
        });

        // Formulaire de demande de devis
        const quoteForm = document.querySelector('form[data-quote]');
        if (quoteForm) {
            quoteForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitQuoteForm(quoteForm);
            });
        }
    }

    // Scroll vers la section contact
    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            window.scrollTo({
                top: contactSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }

    // Soumission du formulaire de devis
    async submitQuoteForm(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Afficher l'état de chargement
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        try {
            // Récupérer les données du formulaire
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulation d'envoi (à remplacer par votre API)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Succès
            this.showNotification('Votre demande de devis a été envoyée avec succès ! Nous vous contacterons sous 24h.', 'success');
            form.reset();
            
        } catch (error) {
            // Erreur
            this.showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            console.error('Form error:', error);
            
        } finally {
            // Restaurer le bouton
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // Notification
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

    // Méthode pour basculer entre les catégories
    switchCategory(categoryId) {
        const category = document.getElementById(categoryId);
        if (category) {
            window.scrollTo({
                top: category.offsetTop - 120,
                behavior: 'smooth'
            });
        }
    }
}

// Initialiser la page quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.ServicesPage = new ServicesPage();
    
    // Intégration avec le script principal
    if (window.LaboGraphie) {
        // Synchroniser avec la navigation principale
        window.LaboGraphie.updateActiveNavLink();
    }
});

// Exporter pour utilisation globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServicesPage;
}
