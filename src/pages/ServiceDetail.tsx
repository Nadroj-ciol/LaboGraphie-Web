import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateServiceInquiry } from "@/hooks/useServiceInquiries";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { z } from "zod";

// Import images
import service1 from "@/assets/service-1.png";
import service2 from "@/assets/service-2.png";
import service3 from "@/assets/service-3.png";
import service4 from "@/assets/service-4.png";
import service5 from "@/assets/service-5.png";
import service6 from "@/assets/service-6.png";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

// Validation schemas
const nameSchema = z.string().trim().min(1, "Le nom est requis").max(100, "Le nom doit contenir moins de 100 caractères");
const phoneSchema = z.string().trim().min(1, "Le téléphone est requis").max(20, "Le téléphone doit contenir moins de 20 caractères");

// Service data
const servicesData: Record<string, {
  title: string;
  description: string;
  image: string;
  aboutTitle: string;
  aboutDescription: string;
  included: string[];
  benefits: string[];
  workSteps: { number: string; title: string; description: string }[];
}> = {
  "design-branding": {
    title: "Design & Branding",
    description: "Logos, chartes graphiques et supports de communication qui captivent votre audience et donnent à votre marque une identité forte et mémorable.",
    image: service1,
    aboutTitle: "À propos de ce service",
    aboutDescription: "Notre laboratoire créatif conçoit des identités visuelles cohérentes et impactantes pour les entreprises et institutions camerounaises. Du logo à la charte graphique complète, chaque élément est pensé pour refléter les valeurs de votre marque et marquer durablement votre audience.\n\nNous travaillons en étroite collaboration avec vous, de la recherche d'identité jusqu'à la livraison des fichiers finaux, en passant par plusieurs itérations pour garantir un résultat qui vous ressemble.",
    included: [
      "Étude de marché et analyse de la concurrence pour positionner votre marque",
      "Création de logo, charte graphique et déclinaisons pour tous vos supports",
      "Livraison de fichiers sources et guide d'utilisation de la marque"
    ],
    benefits: [
      "Une identité visuelle professionnelle qui renforce la crédibilité de votre entreprise",
      "Une cohérence sur tous vos supports de communication, print et digital",
      "Un accompagnement personnalisé à chaque étape du projet",
      "Des livrables adaptés aux réalités du marché camerounais"
    ],
    workSteps: [
      { number: "01", title: "Brief & Analyse", description: "Nous échangeons sur vos objectifs, votre marché et votre audience pour cadrer le projet." },
      { number: "02", title: "Recherche créative", description: "Notre équipe explore plusieurs pistes créatives et vous présente des concepts adaptés." },
      { number: "03", title: "Conception & Validation", description: "Nous affinons la direction retenue avec vous jusqu'à obtenir le résultat parfait." },
      { number: "04", title: "Livraison finale", description: "Vous recevez tous les fichiers et un guide complet pour utiliser votre marque au quotidien." }
    ]
  },
  "developpement-web": {
    title: "Développement Web & Mobile",
    description: "Sites vitrines, plateformes e-commerce et applications sur mesure : performants, sécurisés et pensés pour convertir vos visiteurs en clients.",
    image: service2,
    aboutTitle: "À propos de ce service",
    aboutDescription: "LaboGraphie conçoit et développe des sites web et applications mobiles sur mesure, alliant performance technique et expérience utilisateur soignée. Que vous ayez besoin d'un site vitrine, d'une boutique en ligne ou d'une application métier, notre équipe vous accompagne de A à Z.\n\nNous utilisons des technologies modernes et robustes pour garantir des solutions rapides, sécurisées et évolutives, adaptées aux réalités de connexion et d'usage au Cameroun.",
    included: [
      "Analyse des besoins et conception UX/UI adaptée à vos utilisateurs",
      "Développement front-end et back-end avec des technologies modernes",
      "Tests, mise en ligne et formation à la prise en main de votre plateforme"
    ],
    benefits: [
      "Un site ou une application rapide, sécurisée et responsive",
      "Une expérience utilisateur pensée pour convertir vos visiteurs en clients",
      "Un accompagnement technique après la mise en ligne",
      "Des solutions évolutives qui grandissent avec votre activité"
    ],
    workSteps: [
      { number: "01", title: "Cadrage du projet", description: "Nous définissons ensemble le périmètre, les fonctionnalités et le planning de réalisation." },
      { number: "02", title: "Design & Maquettes", description: "Nous créons des maquettes claires et ergonomiques avant tout développement." },
      { number: "03", title: "Développement & Tests", description: "Notre équipe code, teste et optimise chaque fonctionnalité de votre plateforme." },
      { number: "04", title: "Mise en ligne", description: "Nous déployons votre projet et assurons son bon fonctionnement dans la durée." }
    ]
  },
  "marketing-digital": {
    title: "Marketing Digital",
    description: "Stratégies SEO, gestion de réseaux sociaux et campagnes publicitaires percutantes pour accroître votre visibilité et générer des leads qualifiés.",
    image: service3,
    aboutTitle: "À propos de ce service",
    aboutDescription: "Notre équipe marketing élabore des stratégies digitales complètes pour renforcer votre présence en ligne et générer des résultats concrets. Référencement naturel, gestion des réseaux sociaux, publicité en ligne : nous mettons en place les leviers adaptés à vos objectifs.\n\nChaque campagne est pilotée avec des indicateurs de performance clairs, pour vous permettre de mesurer le retour sur investissement de vos actions marketing.",
    included: [
      "Audit de votre présence digitale et définition d'une stratégie sur mesure",
      "Création de contenus et gestion quotidienne de vos réseaux sociaux",
      "Suivi des performances et rapports mensuels détaillés"
    ],
    benefits: [
      "Une visibilité accrue auprès de votre audience cible",
      "Des leads qualifiés grâce à des campagnes ciblées et optimisées",
      "Un contenu régulier et cohérent avec votre identité de marque",
      "Des rapports transparents pour suivre vos résultats en temps réel"
    ],
    workSteps: [
      { number: "01", title: "Audit & Stratégie", description: "Nous analysons votre présence actuelle et définissons les objectifs de la campagne." },
      { number: "02", title: "Planification de contenu", description: "Nous élaborons un calendrier éditorial adapté à vos canaux et à votre audience." },
      { number: "03", title: "Diffusion & Publicité", description: "Nous lançons les campagnes et optimisons les budgets pour maximiser l'impact." },
      { number: "04", title: "Analyse des résultats", description: "Nous mesurons les performances et ajustons la stratégie pour de meilleurs résultats." }
    ]
  },
  "cybersecurite": {
    title: "Cybersécurité",
    description: "Audits, tests d'intrusion et solutions de protection contre les cybermenaces pour sécuriser vos données et la continuité de votre activité.",
    image: service4,
    aboutTitle: "À propos de ce service",
    aboutDescription: "Face à la montée des cybermenaces, LaboGraphie propose des solutions de cybersécurité complètes pour protéger vos systèmes, vos données et la continuité de votre activité. Nos experts réalisent des audits approfondis et des tests d'intrusion pour identifier les failles avant qu'elles ne soient exploitées.\n\nNous accompagnons également nos clients dans la mise en conformité et la mise en place de bonnes pratiques de sécurité au quotidien.",
    included: [
      "Audit complet de vos systèmes, réseaux et applications",
      "Tests d'intrusion applicatifs et réseau réalisés par nos experts",
      "Plan d'action et recommandations pour renforcer votre sécurité"
    ],
    benefits: [
      "Une meilleure protection de vos données sensibles et de celles de vos clients",
      "Une réduction significative des risques de cyberattaques",
      "Une conformité renforcée avec les bonnes pratiques du secteur",
      "Un accompagnement continu pour maintenir un haut niveau de sécurité"
    ],
    workSteps: [
      { number: "01", title: "Diagnostic initial", description: "Nous évaluons l'état actuel de la sécurité de vos systèmes et infrastructures." },
      { number: "02", title: "Tests d'intrusion", description: "Nos experts simulent des attaques réelles pour identifier les vulnérabilités." },
      { number: "03", title: "Correction des failles", description: "Nous vous accompagnons dans la mise en place des correctifs nécessaires." },
      { number: "04", title: "Suivi & Prévention", description: "Nous assurons un suivi régulier pour maintenir votre sécurité dans le temps." }
    ]
  },
  "formations-pro": {
    title: "Formations Pro",
    description: "Programmes de coaching digital et de formation continue adaptés à vos équipes : design, développement, bureautique avancée et cybersécurité.",
    image: service5,
    aboutTitle: "À propos de ce service",
    aboutDescription: "LaboGraphie forme depuis plusieurs années des étudiants et professionnels camerounais aux métiers du numérique. Nos programmes couvrent le design, le développement, la bureautique avancée et la cybersécurité, avec une approche pratique et orientée résultats.\n\nAvec plus de 500 étudiants formés, nous mettons un point d'honneur à transmettre des compétences directement applicables sur le marché du travail.",
    included: [
      "Programme pédagogique structuré, adapté au niveau des participants",
      "Formateurs expérimentés et exercices pratiques sur des cas réels",
      "Certificat de fin de formation et suivi post-formation"
    ],
    benefits: [
      "Des compétences directement applicables dans le monde professionnel",
      "Un accompagnement personnalisé tout au long du parcours",
      "Des formateurs experts issus du terrain",
      "Des formats flexibles adaptés aux particuliers et aux entreprises"
    ],
    workSteps: [
      { number: "01", title: "Évaluation des besoins", description: "Nous identifions vos objectifs et le niveau des participants avant la formation." },
      { number: "02", title: "Conception du programme", description: "Nous construisons un parcours pédagogique adapté à vos besoins spécifiques." },
      { number: "03", title: "Sessions pratiques", description: "Les participants apprennent par la pratique, avec des cas concrets et des exercices." },
      { number: "04", title: "Certification & Suivi", description: "Nous délivrons un certificat et assurons un accompagnement après la formation." }
    ]
  },
  "maintenance-it": {
    title: "Maintenance IT & Réseau",
    description: "Support technique, infrastructure réseau et maintenance préventive pour garder votre parc informatique fiable, rapide et toujours disponible.",
    image: service6,
    aboutTitle: "À propos de ce service",
    aboutDescription: "Notre équipe technique assure la maintenance et le support de votre parc informatique et de votre infrastructure réseau. Interventions ponctuelles, contrats de maintenance mensuels ou installation complète de réseau : nous garantissons la fiabilité et la disponibilité de vos systèmes.\n\nNotre objectif est de réduire les temps d'arrêt et de vous permettre de vous concentrer sur votre cœur de métier en toute sérénité.",
    included: [
      "Diagnostic et dépannage rapide de vos équipements informatiques",
      "Maintenance préventive et surveillance continue de votre infrastructure",
      "Installation et configuration de réseaux fiables et sécurisés"
    ],
    benefits: [
      "Une réduction significative des pannes et interruptions d'activité",
      "Un support technique réactif et disponible en cas d'urgence",
      "Une infrastructure réseau stable et performante",
      "Un interlocuteur unique pour l'ensemble de votre parc informatique"
    ],
    workSteps: [
      { number: "01", title: "Prise de contact & Diagnostic", description: "Nous évaluons l'état de votre parc informatique et vos besoins spécifiques." },
      { number: "02", title: "Planification des interventions", description: "Nous établissons un plan de maintenance adapté à votre activité." },
      { number: "03", title: "Intervention technique", description: "Nos techniciens interviennent pour réparer, installer ou configurer vos équipements." },
      { number: "04", title: "Suivi & Assistance", description: "Nous restons disponibles pour toute assistance technique après l'intervention." }
    ]
  }
};

// FlipButton component
const FlipButton = ({
  children,
  variant = "primary"
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) => {
  const bgClass = variant === "primary" ? "bg-primary" : "bg-secondary";
  return (
    <button className={`group relative px-8 py-4 ${bgClass} rounded-full overflow-hidden`}>
      <span className="relative block overflow-hidden h-6">
        <span className="block transition-transform duration-300 group-hover:-translate-y-full text-white font-semibold">
          {children}
        </span>
        <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full text-white font-semibold">
          {children}
        </span>
      </span>
    </button>
  );
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = servicesData[slug || ""] || servicesData["developpement-web"];
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedService, setSelectedService] = useState(slug || "developpement-web");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createInquiry = useCreateServiceInquiry();

  // Auto-fill form when user is logged in
  useEffect(() => {
    if (user) {
      // Set full name from profile or user metadata
      if (!fullName) {
        const name = profile?.full_name || user.user_metadata?.full_name || "";
        setFullName(name);
      }

      // Set phone from profile or user metadata
      if (!phone) {
        const userPhone = profile?.phone || user.user_metadata?.phone || "";
        setPhone(userPhone);
      }
    }
  }, [user, profile, fullName, phone]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameResult = nameSchema.safeParse(fullName);
    if (!nameResult.success) {
      newErrors.fullName = nameResult.error.errors[0].message;
    }

    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success) {
      newErrors.phone = phoneResult.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const serviceName = servicesData[selectedService]?.title || service.title;

    await createInquiry.mutateAsync({
      service_name: serviceName,
      full_name: fullName.trim(),
      phone: phone.trim(),
      note: note.trim() || null,
      user_id: user?.id || null,
    });


    // Reset form on success
    setFullName("");
    setPhone("");
    setNote("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Service Title Section */}
      <section className="bg-transparent py-12">
        <div className="container-custom section-padding py-12">
          {/* Breadcrumb */}
          <div className="text-muted-foreground text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          </div>

          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-4">
              <h2 className="text-black text-5xl md:text-7xl font-bold">{service.title}</h2>
              <Link to="/quote">
                <FlipButton variant="primary">Demander un devis</FlipButton>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <p className="text-muted-foreground text-lg max-w-xl mb-12">{service.description}</p>
          </FadeIn>

          {/* Hero Image */}
          <FadeIn delay={200}>
            <div className="rounded-xl overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section with Contact Form */}
      <section className="pt-16">
        <div className="container-custom section-padding">
          <div className="flex lg:flex-row flex-col gap-24">
            {/* Left - About Content */}
            <div className="w-full max-w-[640px]">
              <FadeIn>
                <p className="text-primary font-semibold mb-4">Détails du service</p>
                <h3 className="text-4xl md:text-5xl font-bold text-black mb-6">{service.aboutTitle}</h3>
              </FadeIn>

              <FadeIn delay={100}>
                <div className="text-muted-foreground font-medium leading-relaxed mb-8 whitespace-pre-line">
                  {service.aboutDescription}
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <h4 className="text-2xl font-bold text-black mb-4">Ce qui est inclus ?</h4>
                <div className="space-y-4">
                  {service.included.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
              <section className=" py-16 lg:py-32">
                <div className="container-custom">
                  <FadeIn>
                    <p className="text-primary font-bold mb-4">Notre méthode</p>
                    <h3 className="text-4xl md:text-5xl font-bold text-black mb-4">Comment nous travaillons</h3>
                    <p className="text-muted-foreground max-w-2xl mb-12">
                      Une méthodologie éprouvée, du premier échange à la livraison finale, pour garantir des résultats concrets et durables pour votre entreprise.
                    </p>
                  </FadeIn>

                  <div className="grid md:grid-cols-2 gap-12">
                    {service.workSteps.map((step, index) => (
                      <FadeIn key={index} delay={index * 100}>
                        <div className="flex flex-col gap-4">
                          <div className="w-14 h-14 rounded-full border border-secondary flex items-center justify-center flex-shrink-0">
                            <span className="text-secondary font-bold">{step.number}</span>
                          </div>
                          <div>
                            <h5 className="text-2xl font-bold text-black mb-2">{step.title}</h5>
                            <p className="text-muted-foreground font-medium">{step.description}</p>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </section>

              {/* Service Benefits Section */}
              <section className="pt-16">
                <div className="container-custom">
                  <div className="grid gap-16 items-center">
                    {/* Left - Benefits Content */}
                    <div>
                      <FadeIn>
                        <p className="text-primary font-bold mb-4">Avantages</p>
                        <h3 className="text-3xl md:text-5xl font-bold text-black mb-6">Les avantages du service</h3>
                        <p className="text-muted-foreground font-medium mb-8">
                          Faire appel à LaboGraphie, c'est bénéficier d'une expertise locale, d'un accompagnement de proximité et de solutions digitales adaptées aux réalités du marché camerounais.
                        </p>
                      </FadeIn>

                      <FadeIn delay={100}>
                        <div className="space-y-4">
                          {service.benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <p className="text-muted-foreground font-medium">{benefit}</p>
                            </div>
                          ))}
                        </div>
                      </FadeIn>
                    </div>

                    {/* Right - Image */}
                    <FadeIn delay={200}>
                      <div className="rounded-xl overflow-hidden">
                        <img
                          src={service.image}
                          alt="Avantages du service"
                          className="w-full h-[400px] object-cover"
                        />
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </section>
            </div>

            {/* Right - Contact Form */}
            <div className="flex sticky top-10 h-fit justify-end">
              <FadeIn className="w-[460px]" delay={300}>
                <div className="bg-[#f4f4f7]  p-8 rounded-xl">
                  <h4 className="text-3xl font-bold text-black mb-6">Contactez-nous</h4>

                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div>
                      <label className=" font-bold text-black mb-2 block">Nom complet</label>
                      <Input
                        className="bg-transparent h-12"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Entrez votre nom"
                      />
                      {errors.fullName && (
                        <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className=" font-bold text-black mb-2 block">Téléphone</label>
                      <Input
                        className="bg-transparent border-border h-12"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Entrez votre numéro de téléphone"
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className=" font-bold text-black mb-2 block">Choisir un service</label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="bg-transparent h-12 border-border">
                          <SelectValue placeholder="Sélectionnez un service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design-branding">Design & Branding</SelectItem>
                          <SelectItem value="developpement-web">Développement Web & Mobile</SelectItem>
                          <SelectItem value="marketing-digital">Marketing Digital</SelectItem>
                          <SelectItem value="cybersecurite">Cybersécurité</SelectItem>
                          <SelectItem value="formations-pro">Formations Pro</SelectItem>
                          <SelectItem value="maintenance-it">Maintenance IT & Réseau</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className=" font-bold text-black mb-2 block">Message</label>
                      <Textarea
                        placeholder="Écrivez ici.."
                        className="bg-transparent border-border min-h-[100px]"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-secondary/90 text-white py-6"
                      disabled={createInquiry.isPending}
                    >
                      {createInquiry.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        "Envoyer"
                      )}
                    </Button>
                  </form>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>


      <CTA />
      <Footer />
    </div>
  );
};

export default ServiceDetail;
