import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Check, CheckCircle2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Import images
import bathroomRemodel from "@/assets/bathroom-remodel.jpg";
import completedBathroom from "@/assets/completed-bathroom.jpg";
import completedKitchen from "@/assets/completed-kitchen.jpg";
import drainCleaning from "@/assets/drain-cleaning.jpg";
import faucetRepair from "@/assets/faucet-repair.jpg";
import heroGrid1 from "@/assets/hero-grid-1.jpg";
import heroGrid2 from "@/assets/hero-grid-2.jpg";
import heroGrid3 from "@/assets/hero-grid-3.jpg";
import heroGrid4 from "@/assets/hero-grid-4.jpg";
import problem1 from "@/assets/problem-1.png";
import problem2 from "@/assets/problem-11.png";
import solution1 from "@/assets/solution-1.png";
import solution2 from "@/assets/solution-11.png";

const worksData: Record<string, {
  image: string;
  title: string;
  description: string;
  detailTitle: string;
  detailDescription: string;
  overview: string[];
  client: string;
  budget: string;
  services: string;
  location: string;
  date: string;
  workSteps: { number: string; title: string; description: string }[];
  problems: string[];
  solutions: string[];
}> = {
  "identite-visuelle-novatech": {
    image: completedBathroom,
    title: "Identité Visuelle Novatech",
    description: "Création complète d'une identité de marque : logo, charte graphique et supports de communication pour une startup tech en pleine croissance à Douala.",
    detailTitle: "Une marque forte pour une startup ambitieuse",
    detailDescription: "Novatech souhaitait une identité visuelle moderne et mémorable pour se démarquer sur le marché camerounais. Notre équipe a conçu un univers graphique cohérent, du logo aux supports imprimés et digitaux.",
    overview: [
      "Recherche de positionnement et étude de la concurrence locale",
      "Création du logo, de la palette de couleurs et de la typographie",
      "Déclinaison sur cartes de visite, réseaux sociaux et signature email",
    ],
    client: "Novatech SARL",
    budget: "850 000 FCFA",
    services: "Design & Branding",
    location: "Douala, Cameroun",
    date: "20 Février 2026",
    workSteps: [
      { number: "01", title: "Brief & Recherche", description: "Analyse approfondie du marché, des concurrents et des valeurs de la marque pour poser des bases solides." },
      { number: "02", title: "Conception créative", description: "Élaboration de plusieurs pistes graphiques et sélection collaborative avec le client." },
      { number: "03", title: "Développement & Déclinaisons", description: "Finalisation du logo et création de l'ensemble des supports de communication." },
      { number: "04", title: "Livraison & Charte graphique", description: "Remise du dossier de marque complet avec guide d'utilisation de l'identité visuelle." }
    ],
    problems: ["Absence d'identité visuelle cohérente sur les différents supports.", "Faible reconnaissance de la marque auprès du public cible.", "Communication visuelle peu adaptée aux standards du marché numérique."],
    solutions: ["Conception d'une identité de marque moderne, cohérente et différenciante.", "Mise en place d'une charte graphique complète et facile à décliner.", "Accompagnement dans le déploiement de la marque sur tous les canaux."]
  },
  "plateforme-ecommerce-candace": {
    image: completedKitchen,
    title: "Plateforme E-commerce Candace",
    description: "Conception et développement d'une boutique en ligne moderne avec paiement mobile money, gestion de stock et tableau de bord administrateur.",
    detailTitle: "Une boutique en ligne performante et locale",
    detailDescription: "Candace souhaitait vendre ses produits en ligne avec une expérience utilisateur fluide, adaptée aux réalités camerounaises, notamment le paiement via Mobile Money et Orange Money.",
    overview: [
      "Développement d'une boutique en ligne responsive et rapide",
      "Intégration des paiements Mobile Money et carte bancaire",
      "Tableau de bord de gestion des commandes et du stock",
    ],
    client: "Candace Boutique",
    budget: "1 950 000 FCFA",
    services: "Développement Web & Mobile",
    location: "Yaoundé, Cameroun",
    date: "15 Janvier 2026",
    workSteps: [
      { number: "01", title: "Cadrage & Maquettage", description: "Définition des besoins métiers et création des maquettes UX/UI de la plateforme." },
      { number: "02", title: "Développement", description: "Construction de la boutique en ligne avec un back-office complet et sécurisé." },
      { number: "03", title: "Intégration des paiements", description: "Connexion des solutions Mobile Money et passerelles de paiement locales." },
      { number: "04", title: "Mise en ligne & Formation", description: "Déploiement de la plateforme et formation de l'équipe à son utilisation." }
    ],
    problems: ["Absence de canal de vente en ligne adapté au marché local.", "Difficulté à proposer des moyens de paiement accessibles aux clients.", "Gestion manuelle et chronophage des commandes et du stock."],
    solutions: ["Développement d'une plateforme e-commerce moderne et intuitive.", "Intégration de solutions de paiement mobile adaptées au Cameroun.", "Automatisation de la gestion des stocks et du suivi des commandes."]
  },
  "application-gestion-petittri": {
    image: drainCleaning,
    title: "Application de Gestion PetitTri",
    description: "Développement d'une application mobile de gestion de tri des déchets, incluant géolocalisation, notifications et interface intuitive pour les usagers.",
    detailTitle: "Une application mobile au service de l'écologie urbaine",
    detailDescription: "PetitTri avait besoin d'une application mobile capable de coordonner la collecte des déchets triés en zone urbaine, avec géolocalisation en temps réel et notifications automatiques.",
    overview: [
      "Développement natif pour Android et iOS",
      "Système de géolocalisation des points de collecte",
      "Notifications push pour les usagers et les agents de collecte",
    ],
    client: "PetitTri Cameroun",
    budget: "2 400 000 FCFA",
    services: "Développement Web & Mobile",
    location: "Yaoundé, Cameroun",
    date: "10 Décembre 2025",
    workSteps: [
      { number: "01", title: "Étude de faisabilité", description: "Analyse des besoins terrain et définition des fonctionnalités clés de l'application." },
      { number: "02", title: "Conception UX/UI", description: "Création d'une interface simple et accessible pour tous les profils d'utilisateurs." },
      { number: "03", title: "Développement mobile", description: "Programmation de l'application avec intégration de la géolocalisation en temps réel." },
      { number: "04", title: "Tests & Déploiement", description: "Phase de tests utilisateurs suivie du lancement sur les stores mobiles." }
    ],
    problems: ["Manque de coordination entre les usagers et les agents de collecte.", "Absence d'outil de suivi en temps réel des tournées de collecte.", "Faible taux de participation des habitants au tri sélectif."],
    solutions: ["Développement d'une application mobile intuitive et géolocalisée.", "Mise en place de notifications automatiques pour informer les usagers.", "Amélioration de l'engagement grâce à une expérience utilisateur fluide."]
  },
  "refonte-site-institutionnel": {
    image: drainCleaning,
    title: "Refonte Site Institutionnel",
    description: "Refonte complète du site web d'une institution publique : nouvelle arborescence, design responsive et optimisation SEO pour une meilleure visibilité.",
    detailTitle: "Un site institutionnel moderne et accessible",
    detailDescription: "Cette institution disposait d'un site vieillissant, peu lisible et non optimisé pour les moteurs de recherche. LaboGraphie a entièrement repensé l'expérience utilisateur et la structure du contenu.",
    overview: [
      "Refonte de l'arborescence et du parcours utilisateur",
      "Design responsive adapté à tous les écrans",
      "Optimisation SEO technique et éditoriale",
    ],
    client: "Institution Publique",
    budget: "1 600 000 FCFA",
    services: "Développement Web & Mobile",
    location: "Yaoundé, Cameroun",
    date: "28 Novembre 2025",
    workSteps: [
      { number: "01", title: "Audit du site existant", description: "Analyse du site actuel, des contenus et des points de friction pour les utilisateurs." },
      { number: "02", title: "Refonte UX/UI", description: "Redéfinition de l'arborescence et création de nouvelles maquettes ergonomiques." },
      { number: "03", title: "Développement & SEO", description: "Intégration technique du nouveau site avec optimisation pour les moteurs de recherche." },
      { number: "04", title: "Mise en ligne", description: "Déploiement du site et accompagnement pour la gestion de contenu au quotidien." }
    ],
    problems: ["Interface obsolète et peu adaptée aux mobiles.", "Mauvais référencement sur les moteurs de recherche.", "Navigation confuse pour les usagers en quête d'informations."],
    solutions: ["Refonte complète avec un design moderne et responsive.", "Mise en œuvre d'une stratégie SEO technique et éditoriale.", "Simplification de la navigation et de l'accès à l'information."]
  },
  "audit-cybersecurite": {
    image: bathroomRemodel,
    title: "Audit de Cybersécurité",
    description: "Audit approfondi de l'infrastructure numérique d'une entreprise, identification des vulnérabilités et mise en place de mesures de protection renforcées.",
    detailTitle: "Sécuriser l'infrastructure numérique d'une entreprise",
    detailDescription: "Face à des risques croissants de cyberattaques, cette entreprise a fait appel à LaboGraphie pour réaliser un audit complet de sécurité et renforcer la protection de ses systèmes d'information.",
    overview: [
      "Analyse des vulnérabilités des systèmes et réseaux",
      "Tests d'intrusion et simulation d'attaques",
      "Recommandations et plan d'action de sécurisation",
    ],
    client: "Groupe Industriel Privé",
    budget: "2 800 000 FCFA",
    services: "Cybersécurité",
    location: "Douala, Cameroun",
    date: "5 Octobre 2025",
    workSteps: [
      { number: "01", title: "Cartographie du système", description: "Inventaire complet des infrastructures, applications et flux de données de l'entreprise." },
      { number: "02", title: "Tests de vulnérabilité", description: "Réalisation de tests d'intrusion pour identifier les failles exploitables." },
      { number: "03", title: "Analyse & Rapport", description: "Rédaction d'un rapport détaillé des risques identifiés et de leur criticité." },
      { number: "04", title: "Mise en œuvre des correctifs", description: "Accompagnement dans la mise en place des mesures de sécurité recommandées." }
    ],
    problems: ["Absence de politique de sécurité informatique formalisée.", "Vulnérabilités critiques non détectées sur le réseau interne.", "Sensibilisation insuffisante des équipes aux risques cyber."],
    solutions: ["Réalisation d'un audit de sécurité complet et documenté.", "Correction des failles critiques identifiées sur l'infrastructure.", "Formation des équipes aux bonnes pratiques de cybersécurité."]
  },
  "campagne-social-media": {
    image: heroGrid1,
    title: "Campagne Social Media",
    description: "Stratégie et gestion de campagnes sur les réseaux sociaux pour une marque locale, avec création de contenu et augmentation significative de l'engagement.",
    detailTitle: "Booster la visibilité d'une marque locale",
    detailDescription: "Cette marque souhaitait renforcer sa présence sur les réseaux sociaux et engager davantage sa communauté. LaboGraphie a mis en place une stratégie de contenu et de campagnes publicitaires ciblées.",
    overview: [
      "Élaboration d'une stratégie éditoriale sur mesure",
      "Création de contenus visuels et vidéos engageants",
      "Gestion de campagnes publicitaires ciblées et suivi des performances",
    ],
    client: "Marque Locale de Mode",
    budget: "650 000 FCFA / mois",
    services: "Marketing Digital",
    location: "Yaoundé, Cameroun",
    date: "18 Septembre 2025",
    workSteps: [
      { number: "01", title: "Audit & Stratégie", description: "Analyse de la présence existante et définition des objectifs de communication." },
      { number: "02", title: "Création de contenu", description: "Production de visuels, vidéos et textes adaptés à chaque plateforme sociale." },
      { number: "03", title: "Diffusion & Publicité", description: "Mise en place des campagnes publicitaires ciblées selon les audiences définies." },
      { number: "04", title: "Analyse des résultats", description: "Suivi des performances et ajustement continu de la stratégie pour maximiser l'impact." }
    ],
    problems: ["Faible engagement de la communauté sur les réseaux sociaux.", "Manque de régularité et de cohérence dans la publication de contenu.", "Budget publicitaire mal exploité et peu ciblé."],
    solutions: ["Mise en place d'un calendrier éditorial cohérent et régulier.", "Création de contenus créatifs générant plus d'interactions.", "Optimisation des campagnes publicitaires pour un meilleur retour sur investissement."]
  },
};

const WorkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const work = slug ? worksData[slug] : null;

  if (!work) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Réalisation introuvable</h1>
          <Link to="/work" className="text-primary hover:underline">
            Retour aux réalisations
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 lg:pt-32 bg-card">
        <div className="container-custom section-padding">
          {/* Breadcrumb */}
          <FadeIn>
            <div className="text-muted-foreground text-sm mb-4 text-center">
              <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span className="mx-2">/</span>
              <Link to="/work" className="hover:text-primary transition-colors">Réalisations</Link>
            </div>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={100}>
            <h1 className="text-black font-bold text-center mb-4">{work.title}</h1>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={200}>
            <p className="text-muted-foreground font-medium text-center max-w-2xl mx-auto mb-12">
              {work.description}
            </p>
          </FadeIn>

          {/* Hero Image */}
          <FadeIn delay={300}>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Work Details Section */}
      <section className="bg-card">
        <div className="container-custom pt-20 section-padding">
          <div className="grid lg:grid-cols-3 gap-0">
            {/* Left Content */}
            <div className="lg:col-span-2 max-w-[640px]">
              <FadeIn>
                <span className="text-primary font-bold uppercase tracking-wider">
                  Détails du projet
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-black mt-2 mb-6">
                  {work.detailTitle}
                </h2>
                <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                  {work.detailDescription}
                </p>
              </FadeIn>

              <FadeIn delay={100}>
                <h3 className="text-2xl font-bold text-black mb-4">Aperçu</h3>
                <p className="text-muted-foreground font-medium mb-6">
                  Notre équipe a travaillé en étroite collaboration avec le client afin de garantir
                  un résultat aligné avec ses objectifs stratégiques et sa vision de marque.
                </p>
              </FadeIn>

              <FadeIn delay={200}>
                <ul className="space-y-4">
                  {work.overview.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 min-w-[460px] -translate-x-[55px]">
              <FadeIn delay={300}>
                <div className="bg-[#f4f4f7] rounded-2xl p-8 shadow-sm">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-black text-2xl font-bold">Client</span>
                      <p className="text-muted-foreground font-semibold">{work.client}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-black text-2xl font-bold">Budget</span>
                      <p className="text-muted-foreground font-semibold">{work.budget}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-black text-2xl font-bold">Services</span>
                      <p className="text-muted-foreground font-semibold">{work.services}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-black text-2xl font-bold">Localisation</span>
                      <p className="text-muted-foreground font-semibold">{work.location}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-black text-2xl font-bold">Date</span>
                      <p className="text-muted-foreground font-semibold">{work.date}</p>
                    </div>

                    <div>
                      <span className="text-black text-2xl font-bold block mb-3">Partager</span>
                      <div className="flex gap-3">
                        <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-secondary/90 transition-colors">
                          <Facebook className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-secondary/90 transition-colors">
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-secondary/90 transition-colors">
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-secondary/90 transition-colors">
                          <Instagram className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card lg:py-32 pb-8 lg:pb-16">
        <div className="grid gap-12 lg:grid-cols-2 container-custom section-padding">
          {/* Left - 2x2 Image Grid */}
          <div className="flex gap-8 h-fit">
            <div className="flex flex-col gap-4">
              <FadeIn delay={100}>
                <div className="rounded-xl overflow-hidden mt-12 h-[320px]">
                  <img
                    src={heroGrid1}
                    alt="Étape du projet 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="rounded-xl overflow-hidden h-[280px]">
                  <img
                    src={heroGrid2}
                    alt="Étape du projet 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
            </div>
            <div className="flex flex-col gap-4">
              <FadeIn delay={100}>
                <div className="rounded-xl overflow-hidden h-[290px]">
                  <img
                    src={heroGrid3}
                    alt="Étape du projet 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="rounded-xl overflow-hidden h-[310px]">
                  <img
                    src={heroGrid4}
                    alt="Étape du projet 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <FadeIn>
              <p className="text-primary font-bold mb-4">Notre méthode</p>
              <h3 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Le processus que nous suivons</h3>
              <p className="text-muted-foreground max-w-2xl mb-12">
                Une méthodologie éprouvée, de l'analyse initiale à la livraison finale, pour garantir la réussite de chaque projet.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
              {work.workSteps.map((step, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="flex flex-col gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-lg font-bold">{step.number}</span>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-secondary mb-2">{step.title}</h5>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-card lg:py-16 pb-8 lg:pb-16">
        <div className="container-custom section-padding">
          <div className="flex justify-center flex-col items-center w-full mb-20">
            <h2 className="text-black font-bold mb-4">Problème & Solution</h2>
            <p className="text-muted-foreground font-medium text-center max-w-2xl">Chaque projet chez LaboGraphie part d'un diagnostic précis des enjeux du client, suivi d'une solution digitale sur mesure adaptée à son contexte et à ses objectifs.</p>
          </div>

          <div className="space-y-24">

            <FadeIn>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                <div>
                  <h3 className="text-black font-bold mb-4">Problème</h3>
                  <p className="text-muted-foreground mb-8 font-semibold text-justify leading-relaxed">
                    Avant l'intervention de LaboGraphie, le client faisait face à des défis concrets freinant sa croissance digitale et sa capacité à atteindre efficacement son public cible.
                  </p>
                  <ul className="space-y-4">
                    {work.problems.map((problem, index) => <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                      <span className="text-muted-foreground text-lg">{problem}</span>
                    </li>)}
                  </ul>
                </div>
                {/* Right - Image */}
                <FadeIn className="h-[90%]">
                  <div className="relative h-full">
                    <div className="rounded-3xl h-full overflow-hidden">
                      <img src={problem1} alt="Équipe LaboGraphie au travail" className="h-full object-cover" />
                    </div>
                    {/* Experience Badge */}
                    <div className="absolute -bottom-12 w-[240px] h-[240px] -left-12 border-8 border-white overflow-hidden rounded-xl text-white">
                      <img src={problem2} alt="Équipe LaboGraphie au travail" className="h-full object-cover " />
                    </div>
                  </div>
                </FadeIn>
              </div>
            </FadeIn>
            {/* Solutions */}
            <FadeIn>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left - Image */}
                <FadeIn>
                  <div className="relative">
                    <div className="rounded-3xl overflow-hidden">
                      <img src={solution1} alt="Équipe LaboGraphie au travail" className="w-full h-auto object-cover" />
                    </div>
                    {/* Experience Badge */}
                    <div className="absolute -bottom-12 w-[240px] h-[240px] -right-12 border-8 border-white overflow-hidden rounded-xl text-white">
                      <img src={solution2} alt="Équipe LaboGraphie au travail" className="h-full object-cover " />
                    </div>
                  </div>
                </FadeIn>
                <div>
                  <h3 className="text-black font-bold mb-4">Solutions</h3>
                  <p className="text-muted-foreground mb-8 font-semibold text-justify leading-relaxed">
                    Grâce à une approche structurée et à l'expertise de nos équipes, nous avons mis en place des solutions concrètes générant des résultats mesurables pour le client.
                  </p>
                  <ul className="space-y-4">
                    {work.solutions.map((solution, index) => <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                      <span className="text-muted-foreground text-lg">{solution}</span>
                    </li>)}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
};

export default WorkDetail;
