import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";


// FlipButton component
const FlipButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <button className="group w-full relative px-8 py-4 bg-white border-secondary rounded-full overflow-hidden border">
    <span className="relative block overflow-hidden h-6">
      <span className="block transition-transform text-center duration-300 group-hover:-translate-y-full text-secondary font-semibold">
        {children}
      </span>
      <span className="text-center block transition-transform duration-300 group-hover:-translate-y-full text-secondary font-semibold">
        {children}
      </span>
    </span>
  </button>;
};

const formatFCFA = (amount: number) => `${amount.toLocaleString("fr-FR").replace(/,/g, " ")} FCFA`;

const pricingPlans = {
  residential: [
    {
      name: "Essentiel",
      price: 150000,
      billing: "Forfait mensuel",
      features: [
        "10% de réduction sur tous nos services",
        "Site vitrine ou refonte légère",
        "Gestion des réseaux sociaux",
        "Support par e-mail",
        "Rapport mensuel de performance",
      ],
      recommended: false,
    },
    {
      name: "Professionnel",
      price: 350000,
      billing: "Forfait mensuel",
      features: [
        "15% de réduction sur tous nos services",
        "Identité de marque complète",
        "Site web ou e-commerce",
        "Stratégie marketing digital",
        "Audit de sécurité de base",
        "Support prioritaire WhatsApp",
      ],
      recommended: true,
    },
    {
      name: "Sur mesure",
      price: 750000,
      billing: "Forfait mensuel",
      features: [
        "Toutes les prestations Professionnel",
        "Branding 360° et charte graphique",
        "Application web ou mobile",
        "Cybersécurité avancée",
        "Formations pour vos équipes",
        "Chargé de compte dédié",
      ],
      recommended: false,
    },
  ],
  commercial: [
    {
      name: "Starter Entreprise",
      price: 250000,
      billing: "Forfait mensuel",
      features: [
        "10% de réduction sur tous nos services",
        "Site web professionnel",
        "Référencement SEO de base",
        "Maintenance IT ponctuelle",
        "Assistance réactive",
      ],
      recommended: false,
    },
    {
      name: "Business",
      price: 600000,
      billing: "Forfait mensuel",
      features: [
        "20% de réduction sur tous nos services",
        "Plateforme e-commerce complète",
        "Campagne marketing 360°",
        "Test d'intrusion & sécurisation",
        "Support prioritaire 24/7",
        "Maintenance préventive continue",
      ],
      recommended: true,
    },
    {
      name: "Entreprise",
      price: 1200000,
      billing: "Forfait mensuel",
      features: [
        "Toutes les prestations Business",
        "Chargé de compte dédié",
        "Solutions sur mesure",
        "Infrastructure réseau complète",
        "Audit annuel de sécurité",
      ],
      recommended: false,
    },
  ],
};

const faqs = [
  {
    question: "Quels types de services proposez-vous ?",
    answer:
      "Nous proposons une large gamme de services digitaux : design & branding, développement web et mobile, marketing digital, cybersécurité, formations professionnelles et maintenance IT, pour les particuliers comme pour les entreprises.",
  },
  {
    question: "Combien coûte un projet chez LaboGraphie ?",
    answer:
      "Nos tarifs dépendent du type de service, de la complexité du projet et des délais souhaités. Chaque devis est établi sur mesure après un premier échange avec notre équipe à Bastos, Yaoundé.\n\nContactez-nous pour obtenir une estimation gratuite et personnalisée.",
  },
  {
    question: "Quels types de missions ponctuelles réalisez-vous ?",
    answer:
      "Nous intervenons aussi sur des missions ponctuelles : création de logo, refonte de site, campagne publicitaire, audit de sécurité ou formation d'équipe, selon vos besoins spécifiques.",
  },
  {
    question: "Votre agence est-elle enregistrée et assurée ?",
    answer:
      "Oui, LaboGraphie est un cabinet digital enregistré au Cameroun. Toute notre équipe est composée de professionnels qualifiés, garantissant un travail sérieux et conforme aux normes du secteur.",
  },
  {
    question: "Vos prix sont-ils compétitifs et proposez-vous des devis ?",
    answer:
      "Oui, nous offrons des tarifs compétitifs adaptés au marché camerounais et fournissons des devis gratuits pour tous nos services. Contactez-nous pour planifier un rendez-vous avec notre équipe.",
  },
];

const PricingCard = ({
  plan,
  index,
  planType,
  onSelectPlan,
}: {
  plan: (typeof pricingPlans.residential)[0];
  index: number;
  planType: "residential" | "commercial";
  onSelectPlan: (plan: typeof pricingPlans.residential[0], planType: "residential" | "commercial") => void;
}) => {
  const isRecommended = plan.recommended;

  return (
    <FadeIn className="h-full" delay={index * 100}>
      <div className="relative h-full">
        {isRecommended && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium">
              Recommandé
            </span>
          </div>
        )}
        <div
          className={`rounded-2xl p-8 h-full flex flex-col ${isRecommended
            ? "bg-primary text-primary-foreground"
            : "bg-[#f4f4f7]"
            }`}
        >
          <p
            className={`font-medium ${isRecommended ? "text-white" : "text-muted-foreground"
              }`}
          >
            {plan.name}
          </p>

          <div className="mt-4 mb-2">
            <span className="text-4xl md:text-5xl font-bold">{formatFCFA(plan.price)}</span>
          </div>

          <p
            className={`text-sm pb-6 border-b ${isRecommended
              ? "text-primary-foreground/70 border-primary-foreground/20"
              : "text-muted-foreground border-border"
              }`}
          >
            {plan.billing}
          </p>

          <div className="mt-6">
            <h4
              className={`font-bold text-xl mb-4 ${isRecommended ? "text-accent" : "text-black"
                }`}
            >
              Ce qui est inclus
            </h4>

            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${isRecommended ? "bg-accent" : "bg-primary"
                      }`}
                  >
                    <Check
                      className={`w-3 h-3 ${isRecommended
                        ? "text-accent-foreground"
                        : "text-primary-foreground"
                        }`}
                    />
                  </div>
                  <span
                    className={`text-sm ${isRecommended ? "text-primary-foreground/90" : "text-black"
                      }`}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-8">
            <button
              onClick={() => onSelectPlan(plan, planType)}
              className="w-full py-3 rounded-lg font-medium text-center block transition-all"
            >
              <FlipButton>Commencer</FlipButton>
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};
const FAQItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      className={`rounded-xl mb-3 transition-all duration-300 ${isOpen ? "bg-accent" : "bg-[#f4f4f7]"
        }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left"
      >
        <span
          className={`font-bold text-2xl ${isOpen ? "text-accent-foreground" : "text-black"
            }`}
        >
          {faq.question}
        </span>
        <div className="flex-shrink-0 ml-4">
          <X className={`w-5 h-5 text-accent-foreground transition-transform ${isOpen ? "" : "rotate-45"}`} />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 pb-6 px-6" : "max-h-0"
          }`}
      >
        <p className="text-accent-foreground/80 font-medium whitespace-pre-line">{faq.answer}</p>
      </div>
    </div>
  );
};

const Pricing = () => {
  const navigate = useLocalizedNavigate();
  const [activeTab, setActiveTab] = useState<"residential" | "commercial">(
    "residential"
  );
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const handleSelectPlan = (plan: typeof pricingPlans.residential[0], planType: "residential" | "commercial") => {
    navigate("/contact", {
      state: {
        planData: {
          planName: plan.name,
          planType,
          price: plan.price,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container-custom section-padding text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Accueil
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-primary font-medium">Tarifs</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
              Nos Tarifs
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Des solutions digitales expertes et fiables, adaptées à vos besoins de branding,
              développement, marketing et sécurité, pour garantir qualité, efficacité et
              satisfaction totale.
            </p>
          </FadeIn>

          {/* Toggle */}
          <FadeIn delay={100}>
            <div className="inline-flex bg-card rounded-full p-1.5 mt-10">
              <button
                onClick={() => setActiveTab("residential")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${activeTab === "residential"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
                  }`}
              >
                Particuliers & Startups
              </button>
              <button
                onClick={() => setActiveTab("commercial")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${activeTab === "commercial"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground "
                  }`}
              >
                Entreprises
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans[activeTab].map((plan, index) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                index={index}
                planType={activeTab}
                onSelectPlan={handleSelectPlan}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pt-16 lg:pt-24 bg-white">
        <div className="container-custom section-padding">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
              Encore des questions ?
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />

      <Footer />
    </div>
  );
};

export default Pricing;
