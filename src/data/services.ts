import service1 from "@/assets/service-1.png";
import service2 from "@/assets/service-2.png";
import service3 from "@/assets/service-3.png";
import service4 from "@/assets/service-4.png";
import service5 from "@/assets/service-5.png";
import service6 from "@/assets/service-6.png";

export interface Service {
  number: string;
  image: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number; // Prix de base (FCFA / jour de travail)
  complexityOptions: ComplexityOption[];
}

export interface ComplexityOption {
  label: string;
  multiplier: number;
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
    basePrice: 75000,
    complexityOptions: [
      { label: "Logo simple", multiplier: 1, description: "Création de logo et déclinaisons de base" },
      { label: "Identité complète", multiplier: 2, description: "Logo, charte graphique et supports print" },
      { label: "Branding 360°", multiplier: 3.5, description: "Stratégie de marque, charte, packaging et supports" },
    ],
  },
  {
    number: "02",
    image: service2,
    title: "Développement Web & Mobile",
    slug: "developpement-web",
    description:
      "Sites vitrines, plateformes e-commerce et applications sur mesure : performants, sécurisés et pensés pour convertir vos visiteurs en clients.",
    basePrice: 150000,
    complexityOptions: [
      { label: "Site vitrine", multiplier: 1, description: "Site de présentation jusqu'à 5 pages" },
      { label: "Site e-commerce", multiplier: 2.5, description: "Boutique en ligne avec paiement intégré" },
      { label: "Application sur mesure", multiplier: 4, description: "Plateforme web ou mobile personnalisée" },
    ],
  },
  {
    number: "03",
    image: service3,
    title: "Marketing Digital",
    slug: "marketing-digital",
    description:
      "Stratégies SEO, gestion de réseaux sociaux et campagnes publicitaires percutantes pour accroître votre visibilité et générer des leads qualifiés.",
    basePrice: 100000,
    complexityOptions: [
      { label: "Community management", multiplier: 1, description: "Gestion mensuelle de vos réseaux sociaux" },
      { label: "SEO & contenu", multiplier: 1.75, description: "Optimisation du référencement et rédaction" },
      { label: "Campagne 360°", multiplier: 3, description: "Stratégie globale, publicité et reporting" },
    ],
  },
  {
    number: "04",
    image: service4,
    title: "Cybersécurité",
    slug: "cybersecurite",
    description:
      "Audits, tests d'intrusion et solutions de protection contre les cybermenaces pour sécuriser vos données et la continuité de votre activité.",
    basePrice: 200000,
    complexityOptions: [
      { label: "Audit de sécurité", multiplier: 1, description: "Diagnostic complet de vos systèmes" },
      { label: "Test d'intrusion", multiplier: 1.75, description: "Pentest applicatif et réseau" },
      { label: "Sécurisation complète", multiplier: 3, description: "Mise en conformité et plan de protection" },
    ],
  },
  {
    number: "05",
    image: service5,
    title: "Formations Pro",
    slug: "formations-pro",
    description:
      "Programmes de coaching digital et de formation continue adaptés à vos équipes : design, développement, bureautique avancée et cybersécurité.",
    basePrice: 50000,
    complexityOptions: [
      { label: "Session découverte", multiplier: 1, description: "Formation d'une journée en groupe" },
      { label: "Parcours complet", multiplier: 2.5, description: "Programme de plusieurs semaines" },
      { label: "Formation en entreprise", multiplier: 4, description: "Programme sur mesure pour vos équipes" },
    ],
  },
  {
    number: "06",
    image: service6,
    title: "Maintenance IT & Réseau",
    slug: "maintenance-it",
    description:
      "Support technique, infrastructure réseau et maintenance préventive pour garder votre parc informatique fiable, rapide et toujours disponible.",
    basePrice: 60000,
    complexityOptions: [
      { label: "Intervention ponctuelle", multiplier: 1, description: "Dépannage et diagnostic sur site" },
      { label: "Contrat mensuel", multiplier: 2, description: "Maintenance préventive et support continu" },
      { label: "Infrastructure réseau", multiplier: 3.5, description: "Installation et gestion de réseau complet" },
    ],
  },
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find((s) => s.slug === slug);
};
