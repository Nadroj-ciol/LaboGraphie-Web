import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { useTranslation } from "react-i18next";


// FlipButton component
const FlipButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return <button onClick={onClick} className="group w-full relative px-8 py-4 bg-background border-secondary rounded-full overflow-hidden border">
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

// Prix et statut "recommandé" : non traduits, associés par index aux
// noms/caractéristiques traduits dans pricing.plans.<planType>.
const pricingMeta = {
  residential: [
    { price: 150000, recommended: false },
    { price: 350000, recommended: true },
    { price: 750000, recommended: false },
  ],
  commercial: [
    { price: 250000, recommended: false },
    { price: 600000, recommended: true },
    { price: 1200000, recommended: false },
  ],
};

interface PricingPlan {
  name: string;
  price: number;
  recommended: boolean;
  features: string[];
}

interface FaqEntry {
  question: string;
  answer: string;
}

const PricingCard = ({
  plan,
  index,
  planType,
  onSelectPlan,
}: {
  plan: PricingPlan;
  index: number;
  planType: "residential" | "commercial";
  onSelectPlan: (plan: PricingPlan, planType: "residential" | "commercial") => void;
}) => {
  const { t } = useTranslation();
  const isRecommended = plan.recommended;

  return (
    <FadeIn className="h-full" delay={index * 100}>
      <div className="relative h-full">
        {isRecommended && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium">
              {t("pricing.recommended")}
            </span>
          </div>
        )}
        <div
          className={`rounded-2xl p-8 h-full flex flex-col ${isRecommended
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
            }`}
        >
          <p
            className={`font-medium ${isRecommended ? "text-primary-foreground" : "text-muted-foreground"
              }`}
          >
            {plan.name}
          </p>

          <div className="mt-4 mb-2">
            <span className={`text-4xl md:text-5xl font-bold ${isRecommended ? "text-primary-foreground" : "text-foreground"}`}>
              {formatFCFA(plan.price)}
            </span>
          </div>

          <p
            className={`text-sm pb-6 border-b ${isRecommended
              ? "text-primary-foreground/70 border-primary-foreground/20"
              : "text-muted-foreground border-border"
              }`}
          >
            {t("pricing.monthlyPlan")}
          </p>

          <div className="mt-6">
            <h4
              className={`font-bold text-xl mb-4 ${isRecommended ? "text-accent" : "text-foreground"
                }`}
            >
              {t("pricing.whatsIncluded")}
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
                    className={`text-sm ${isRecommended ? "text-primary-foreground/90" : "text-foreground"
                      }`}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-8">
            <FlipButton onClick={() => onSelectPlan(plan, planType)}>{t("pricing.getStarted")}</FlipButton>
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
  faq: FaqEntry;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      className={`rounded-xl mb-3 transition-all duration-300 ${isOpen ? "bg-accent" : "bg-muted"
        }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left"
      >
        <span
          className={`font-bold text-2xl ${isOpen ? "text-accent-foreground" : "text-foreground"
            }`}
        >
          {faq.question}
        </span>
        <div className="flex-shrink-0 ml-4">
          <X className={`w-5 h-5 transition-transform ${isOpen ? "text-accent-foreground" : "text-foreground rotate-45"}`} />
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
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();
  const [activeTab, setActiveTab] = useState<"residential" | "commercial">(
    "residential"
  );
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const translatedPlans = t(`pricing.plans.${activeTab}`, { returnObjects: true }) as { name: string; features: string[] }[];
  const pricingPlans: PricingPlan[] = translatedPlans.map((p, i) => ({
    ...p,
    ...pricingMeta[activeTab][i],
  }));

  const faqs = t("pricing.faqs", { returnObjects: true }) as FaqEntry[];

  const handleSelectPlan = (plan: PricingPlan, planType: "residential" | "commercial") => {
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-background">
        <div className="container-custom section-padding text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                {t("common.nav.home")}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-primary font-medium">{t("pricing.breadcrumbLabel")}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
              {t("pricing.title")}
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t("pricing.description")}
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
                {t("pricing.tabResidential")}
              </button>
              <button
                onClick={() => setActiveTab("commercial")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${activeTab === "commercial"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground "
                  }`}
              >
                {t("pricing.tabCommercial")}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-background">
        <div className="container-custom section-padding">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
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
      <section className="pt-16 lg:pt-24 bg-background">
        <div className="container-custom section-padding">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
              {t("pricing.faqTitle")}
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
