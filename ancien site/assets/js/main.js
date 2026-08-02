
/**
 * Labographie - Main JavaScript File
 * Inspiré de digital-college.fr
 */

class LabographieApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialiser les composants
        this.initNavigation();
        this.initAnimations();
        this.initCounters();
        this.initForms();
        this.initScrollEffects();
        this.initMobileMenu();
        this.initLazyLoading();
        
        // Déclencher l'événement de chargement
        document.dispatchEvent(new CustomEvent('labographie:ready'));
        
        // Log de développement
        if (this.isDevelopment()) {
            console.log('%c🎨 Labographie', 'font-size: 20px; font-weight: bold; color: #0a66c2');
            console.log('Site prêt !');
        }
    }

    // Navigation
    initNavigation() {
        const nav = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Navigation scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            // Mise à jour des liens actifs
            this.updateActiveNavLink();
        });
        
        // Smooth scroll pour les ancres
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 100,
                            behavior: 'smooth'
                        });
                        
                        // Fermer le menu mobile s'il est ouvert
                        this.closeMobileMenu();
                    }
                }
            });
        });
    }

    // Menu mobile
    initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileMenuOverlay');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        overlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
        
        // Fermer le menu en cliquant sur les liens
        menu.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }

    toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileMenuOverlay');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Changer l'icône
        const icon = toggle.querySelector('i');
        if (menu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileMenuOverlay');
        const toggle = document.querySelector('.mobile-menu-toggle');
        const icon = toggle.querySelector('i');
        
        menu.classList.remove('active');
        overlay.classList.remove('active');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }

    // Mise à jour du lien actif
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Animations
    initAnimations() {
        // Intersection Observer pour les animations au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Animation spécifique pour les compteurs
                    if (entry.target.classList.contains('stat')) {
                        this.animateCounter(entry.target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observer les éléments à animer
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    // Compteurs animés
    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            // Observer pour déclencher l'animation quand visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const suffix = element.getAttribute('data-suffix') || '';
        let current = 0;
        
        // Si c'est un pourcentage
        const isPercentage = suffix === '%';
        
        const increment = target / 100;
        const duration = 2000; // 2 secondes
        const steps = 100;
        const stepDuration = duration / steps;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (isPercentage) {
                element.textContent = Math.round(current) + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, stepDuration);
    }

    // Formulaires
    initForms() {
        const forms = document.querySelectorAll('form[data-form]');
        
        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('[type="submit"]');
                const originalText = submitBtn.textContent;
                
                // Afficher l'état de chargement
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                
                try {
                    // Simuler un envoi (à remplacer par votre logique d'envoi)
                    await this.simulateFormSubmit(form);
                    
                    // Succès
                    this.showNotification('Message envoyé avec succès !', 'success');
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
            });
        });
    }

    async simulateFormSubmit(form) {
        // Simulation d'un délai d'envoi
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }

    // Notifications
    showNotification(message, type = 'success') {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Ajouter au document
        document.body.appendChild(notification);
        
        // Afficher avec une animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Fermer automatiquement après 5 secondes
        const autoClose = setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
        
        // Bouton de fermeture
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoClose);
            this.closeNotification(notification);
        });
        
        // Fermer en cliquant n'importe où sur la notification
        notification.addEventListener('click', (e) => {
            if (e.target === notification) {
                clearTimeout(autoClose);
                this.closeNotification(notification);
            }
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

    // Effets de scroll
    initScrollEffects() {
        // Effet parallaxe pour les éléments avec data-parallax
        document.querySelectorAll('[data-parallax]').forEach(el => {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                el.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
        });
        
        // Réapparition progressive des éléments
        const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            fadeObserver.observe(el);
        });
    }

    // Chargement paresseux
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Utilitaires
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('vercel.app');
    }

    // Méthode pour formater les nombres
    formatNumber(num) {
        return new Intl.NumberFormat('fr-FR').format(num);
    }

    // Méthode pour obtenir l'URL WhatsApp
    getWhatsAppURL(phone = '237621317408', message = '') {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phone}?text=${encodedMessage}`;
    }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.LaboGraphie = new LabographieApp();
});

// Exporter pour utilisation globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LabographieApp;
}
