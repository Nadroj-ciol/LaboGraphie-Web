import service1 from "@/assets/real-design-branding.webp";
import service2 from "@/assets/service-web-mobile.webp";
import service3 from "@/assets/real-service-marketing.webp";
import service4 from "@/assets/work-cybersecurity-audit.webp";
import service5 from "@/assets/formations-pro-workshop.webp";
import service6 from "@/assets/real-maintenance-it.webp";

export interface Service {
  number: string;
  image: string;
  title: string;
  slug: string;
  description: string;
  localTJM: number; // Taux Journalier Moyen en Afrique (FCFA)
  intlTJM: number;  // Taux Journalier Moyen International (FCFA, sera converti en EUR/USD)
  complexityOptions: ComplexityOption[];
}

export interface ComplexityOption {
  label: string;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  description: string;
}

export const services: Service[] = [
  {
    number: "01",
    image: service1,
    title: "Design & Branding",
    slug: "design-branding",
    description:
      "Logos, chartes graphiques et supports de communication qui captivent votre audience et donnent à votre marque une identité forte et mémorable.",
    localTJM: 50000, 
    intlTJM: 150000, 
    complexityOptions: [
      { label: "Logo simple", estimatedDaysMin: 2, estimatedDaysMax: 5, description: "Création de logo et déclinaisons de base" },
      { label: "Identité complète", estimatedDaysMin: 7, estimatedDaysMax: 14, description: "Logo, charte graphique et supports print" },
      { label: "Branding 360°", estimatedDaysMin: 15, estimatedDaysMax: 30, description: "Stratégie de marque, charte, packaging et supports" },
    ],
  },
  {
    number: "02",
    image: service2,
    title: "Développement Web & Mobile",
    slug: "developpement-web",
    description:
      "Sites vitrines, plateformes e-commerce et applications sur mesure : performants, sécurisés et pensés pour convertir vos visiteurs en clients.",
    localTJM: 75000,
    intlTJM: 250000,
    complexityOptions: [
      { label: "Site vitrine / Landing Page", estimatedDaysMin: 5, estimatedDaysMax: 15, description: "Site de présentation jusqu'à 5 pages" },
      { label: "Site e-commerce / App simple", estimatedDaysMin: 15, estimatedDaysMax: 30, description: "Boutique en ligne avec paiement ou app standard" },
      { label: "Application sur mesure complexe", estimatedDaysMin: 30, estimatedDaysMax: 90, description: "Plateforme web ou mobile complexe sur mesure" },
    ],
  },
  {
    number: "03",
    image: service3,
    title: "Marketing Digital",
    slug: "marketing-digital",
    description:
      "Stratégies SEO, gestion de réseaux sociaux et campagnes publicitaires percutantes pour accroître votre visibilité et générer des leads qualifiés.",
    localTJM: 40000,
    intlTJM: 120000,
    complexityOptions: [
      { label: "Community management (Mensuel)", estimatedDaysMin: 4, estimatedDaysMax: 8, description: "Équivalent jours de travail pour un mois de gestion" },
      { label: "SEO & création de contenu", estimatedDaysMin: 7, estimatedDaysMax: 15, description: "Optimisation de site et rédaction technique" },
      { label: "Campagne publicitaire 360°", estimatedDaysMin: 10, estimatedDaysMax: 20, description: "Stratégie, création de contenu publicitaire et suivi" },
    ],
  },
  {
    number: "04",
    image: service4,
    title: "Cybersécurité",
    slug: "cybersecurite",
    description:
      "Audits, tests d'intrusion et solutions de protection contre les cybermenaces pour sécuriser vos données et la continuité de votre activité.",
    localTJM: 100000,
    intlTJM: 300000,
    complexityOptions: [
      { label: "Audit de sécurité basique", estimatedDaysMin: 3, estimatedDaysMax: 7, description: "Diagnostic rapide de vos systèmes exposés" },
      { label: "Test d'intrusion (Pentest)", estimatedDaysMin: 10, estimatedDaysMax: 20, description: "Attaques simulées sur vos applications/réseau" },
      { label: "Sécurisation complète & Conformité", estimatedDaysMin: 20, estimatedDaysMax: 45, description: "Mise en conformité et plan de protection global" },
    ],
  },
  {
    number: "05",
    image: service5,
    title: "Formations Pro",
    slug: "formations-pro",
    description:
      "Programmes de coaching digital et de formation continue adaptés à vos équipes : design, développement, bureautique avancée et cybersécurité.",
    localTJM: 50000,
    intlTJM: 150000,
    complexityOptions: [
      { label: "Session découverte", estimatedDaysMin: 1, estimatedDaysMax: 3, description: "Formation courte ou masterclass" },
      { label: "Parcours complet (Individuel)", estimatedDaysMin: 5, estimatedDaysMax: 15, description: "Formation approfondie sur un domaine spécifique" },
      { label: "Formation d'équipe sur mesure", estimatedDaysMin: 10, estimatedDaysMax: 30, description: "Programme personnalisé pour votre entreprise" },
    ],
  },
  {
    number: "06",
    image: service6,
    title: "Maintenance IT & Réseau",
    slug: "maintenance-it",
    description:
      "Support technique, infrastructure réseau et maintenance préventive pour garder votre parc informatique fiable, rapide et toujours disponible.",
    localTJM: 50000,
    intlTJM: 150000,
    complexityOptions: [
      { label: "Intervention ponctuelle", estimatedDaysMin: 1, estimatedDaysMax: 2, description: "Dépannage et diagnostic rapide" },
      { label: "Maintenance préventive (Mensuelle)", estimatedDaysMin: 2, estimatedDaysMax: 5, description: "Vérifications et mises à jour régulières" },
      { label: "Déploiement d'infrastructure réseau", estimatedDaysMin: 5, estimatedDaysMax: 20, description: "Installation et configuration de réseau complet" },
    ],
  },
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find((s) => s.slug === slug);
};
