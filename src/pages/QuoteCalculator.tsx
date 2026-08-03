import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { services } from "@/data/services";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCreateQuoteRequest } from "@/hooks/useQuoteRequests";
import { Calendar, Calculator, Check, Clock, DollarSign, Phone, Wrench, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Ces taux pourront plus tard être récupérés depuis une table `settings` de Supabase
const EXCHANGE_RATES = {
  FCFA: 1,
  EUR: 655.957,
  USD: 600,
};

type Currency = "FCFA" | "EUR" | "USD";

const formatCurrency = (amountFCFA: number, currency: Currency) => {
  const amount = amountFCFA / EXCHANGE_RATES[currency];
  
  if (currency === "FCFA") {
    return `${Math.round(amount).toLocaleString("fr-FR").replace(/,/g, " ")} FCFA`;
  }
  
  return new Intl.NumberFormat(currency === "EUR" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export interface QuoteData {
  serviceSlug: string;
  serviceTitle: string;
  complexityLabel: string;
  complexityMultiplier: number;
  estimatedHours: number; // Keeping field for compatibility but representing average days
  urgency: "standard" | "urgent" | "emergency";
  basePrice: number;
  estimatedMin: number;
  estimatedMax: number;
  currency: string;
}

const QuoteCalculator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id);
  const createQuoteMutation = useCreateQuoteRequest();
  
  const [selectedService, setSelectedService] = useState<string>("");
  const [complexity, setComplexity] = useState<number>(0);
  const [urgency, setUrgency] = useState<"standard" | "urgent" | "emergency">("standard");
  const [currency, setCurrency] = useState<Currency>("FCFA");
  const [phone, setPhone] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill phone from profile
  useEffect(() => {
    if (profile?.phone) {
      setPhone(profile.phone);
    }
  }, [profile]);

  const service = services.find((s) => s.slug === selectedService);

  const urgencyMultiplier = {
    standard: 1,
    urgent: 1.25,
    emergency: 1.5,
  };

  const calculateEstimate = () => {
    if (!service) return { min: 0, max: 0, daysMin: 0, daysMax: 0 };

    // Marché local (FCFA) vs International (EUR/USD)
    const tjm = currency === "FCFA" ? service.localTJM : service.intlTJM;
    
    const complexityOption = service.complexityOptions[complexity];
    if (!complexityOption) return { min: 0, max: 0, daysMin: 0, daysMax: 0 };

    const urgencyMult = urgencyMultiplier[urgency];

    const minEstimateFCFA = tjm * complexityOption.estimatedDaysMin * urgencyMult;
    const maxEstimateFCFA = tjm * complexityOption.estimatedDaysMax * urgencyMult;

    return {
      min: minEstimateFCFA,
      max: maxEstimateFCFA,
      daysMin: complexityOption.estimatedDaysMin,
      daysMax: complexityOption.estimatedDaysMax,
    };
  };

  const estimate = calculateEstimate();

  const handleRequestQuote = async () => {
    if (!service) return;

    if (user && !phone.trim()) {
      toast.error("Veuillez saisir votre numéro de téléphone");
      return;
    }

    if (user) {
      setIsSubmitting(true);
      try {
        const avgDays = Math.round((estimate.daysMin + estimate.daysMax) / 2);
        await createQuoteMutation.mutateAsync({
          user_id: user.id,
          full_name: profile?.full_name || user.email?.split("@")[0] || "User",
          phone: phone.trim(),
          email: user.email || null,
          service_slug: service.slug,
          service_title: service.title,
          complexity_label: service.complexityOptions[complexity]?.label || "",
          complexity_multiplier: 1,
          estimated_hours: avgDays, // Saving avg days instead of hours
          urgency,
          base_price: currency === "FCFA" ? service.localTJM : service.intlTJM,
          estimated_min: estimate.min,
          estimated_max: estimate.max,
          notes: `Devise: ${currency}`,
          service_date: serviceDate || null,
        });
        
        toast.success("Demande de devis envoyée ! Retrouvez-la dans votre tableau de bord.");
        navigate("/dashboard/quotes");
      } catch (error) {
        console.error("Error creating quote:", error);
        toast.error("Échec de l'envoi du devis. Veuillez réessayer.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const avgDays = Math.round((estimate.daysMin + estimate.daysMax) / 2);
    const quoteData: QuoteData = {
      serviceSlug: service.slug,
      serviceTitle: service.title,
      complexityLabel: service.complexityOptions[complexity]?.label || "",
      complexityMultiplier: 1,
      estimatedHours: avgDays,
      urgency,
      basePrice: currency === "FCFA" ? service.localTJM : service.intlTJM,
      estimatedMin: estimate.min,
      estimatedMax: estimate.max,
      currency,
    };

    navigate("/contact", { state: { quoteData } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-card">
        <div className="container-custom section-padding text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Accueil
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-primary font-medium">Calculateur de devis</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Obtenez Votre Estimation Gratuite
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Utilisez notre calculateur intelligent pour obtenir une estimation de votre projet.
              Sélectionnez votre devise, votre service, le niveau de complexité, et obtenez une fourchette de prix réaliste.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calculator Form */}
            <FadeIn>
              <div className="bg-[#f3f3f6] sticky top-6 h-max rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-black">Calculateur de Devis</h2>
                </div>

                <div className="space-y-8">
                  {/* Currency Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-black">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Marché / Devise
                    </Label>
                    <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                      <SelectTrigger className="h-14 text-base text-black bg-white">
                        <SelectValue placeholder="Choisissez une devise..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FCFA">Afrique Centrale (XAF / FCFA)</SelectItem>
                        <SelectItem value="EUR">Europe (EUR)</SelectItem>
                        <SelectItem value="USD">International (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-black">
                      Sélectionner un Service
                    </Label>
                    <Select value={selectedService} onValueChange={(val) => {
                      setSelectedService(val);
                      setComplexity(0); // Reset complexity when service changes
                    }}>
                      <SelectTrigger className="h-14 text-base text-black bg-white">
                        <SelectValue placeholder="Choisissez un service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.slug} value={s.slug} className="text-base">
                            {s.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Complexity Selection */}
                  {service && (
                    <FadeIn>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-black">
                          Envergure du Projet
                        </Label>
                        <div className="grid gap-3">
                          {service.complexityOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => setComplexity(index)}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${complexity === index
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-black">{option.label}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {option.description}
                                  </p>
                                </div>
                                {complexity === index && (
                                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ml-4">
                                    <Check className="w-4 h-4 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </FadeIn>
                  )}

                  {/* Urgency Selection */}
                  {service && (
                    <FadeIn delay={100}>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-black">
                          Urgence du Projet
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => setUrgency("standard")}
                            className={`p-3 lg:p-4 rounded-xl border-2 text-center transition-all ${urgency === "standard"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                              }`}
                          >
                            <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                            <p className="font-semibold text-sm text-primary">Standard</p>
                            <p className="text-xs text-muted-foreground">Tarif normal</p>
                          </button>
                          <button
                            onClick={() => setUrgency("urgent")}
                            className={`p-3 lg:p-4 rounded-xl border-2 text-center transition-all ${urgency === "urgent"
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                              }`}
                          >
                            <Clock className="w-5 h-5 mx-auto mb-2 text-yellow-600" />
                            <p className="font-semibold text-sm text-primary">Urgent</p>
                            <p className="text-xs text-muted-foreground">Tarif +25%</p>
                          </button>
                          <button
                            onClick={() => setUrgency("emergency")}
                            className={`p-3 lg:p-4 rounded-xl border-2 text-center transition-all ${urgency === "emergency"
                              ? "border-destructive bg-destructive/5"
                              : "border-border hover:border-destructive/50"
                              }`}
                          >
                            <Clock className="w-5 h-5 mx-auto mb-2 text-destructive" />
                            <p className="font-semibold text-sm text-primary">Urgence</p>
                            <p className="text-xs text-muted-foreground">Tarif +50%</p>
                          </button>
                        </div>
                      </div>
                    </FadeIn>
                  )}

                  {/* Phone Number - Only for logged in users */}
                  {service && user && (
                    <FadeIn delay={200}>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-black">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Numéro de Contact *
                        </Label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+237 6XX XX XX XX"
                          className="h-14 text-base text-black bg-white"
                        />
                      </div>
                    </FadeIn>
                  )}

                  {/* Service Date - Only for logged in users */}
                  {service && user && (
                    <FadeIn delay={300}>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-black">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Date de Démarrage Souhaitée
                        </Label>
                        <Input
                          type="date"
                          value={serviceDate}
                          onChange={(e) => setServiceDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="h-14 text-base text-black bg-white"
                        />
                      </div>
                    </FadeIn>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Estimate Display */}
            <FadeIn delay={100}>
              <div className="lg:sticky lg:top-32 space-y-6">
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Votre Estimation</h2>
                  </div>

                  {service ? (
                    <div className="space-y-6">
                      <div>
                        <p className="text-primary-foreground/70 mb-2">Fourchette de Prix Estimée</p>
                        <p className="text-3xl lg:text-4xl font-bold text-white">
                          {formatCurrency(estimate.min, currency)} - {formatCurrency(estimate.max, currency)}
                        </p>
                      </div>

                      <div className="border-t border-white/20 pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <Wrench className="w-5 h-5 text-accent shrink-0" />
                          <div>
                            <p className="font-medium text-white">{service.title}</p>
                            <p className="text-sm text-primary-foreground/70">
                              {service.complexityOptions[complexity]?.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-accent shrink-0" />
                          <p className="font-medium text-white">Temps estimé : {estimate.daysMin} à {estimate.daysMax} jours</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-accent shrink-0" />
                          <p className="font-medium capitalize text-white">
                            Service {urgency === "standard" ? "standard" : urgency === "urgent" ? "urgent" : "en urgence"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          variant="accent"
                          size="lg"
                          className="w-full rounded-full text-lg py-6"
                          onClick={handleRequestQuote}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Envoi en cours..." : "Demander un Devis Officiel"}
                        </Button>
                        <p className="text-center text-sm text-primary-foreground/60 mt-3">
                          *Ceci est une estimation. Le prix final et le délai peuvent varier après étude détaillée du projet.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calculator className="w-16 h-16 mx-auto mb-4 text-primary-foreground/30" />
                      <p className="text-xl font-medium text-primary-foreground/70">
                        Sélectionnez un service pour voir votre estimation
                      </p>
                    </div>
                  )}
                </div>

                {/* Service Price List (TJM) */}
                <div className="bg-[#f3f3f6] rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-black">Taux Journalier Moyen (TJM)</h3>
                  <div className="space-y-3">
                    {services.map((s) => (
                      <div
                        key={s.slug}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${selectedService === s.slug ? "bg-primary/10" : "hover:bg-primary/10"
                          }`}
                      >
                        <span className="text-sm font-medium text-black">{s.title}</span>
                        <span className="text-sm font-bold text-primary">
                          {formatCurrency(currency === "FCFA" ? s.localTJM : s.intlTJM, currency)} / j
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-primary">
        <div className="container-custom section-padding">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Comment Fonctionnent Nos Tarifs
              </h2>
              <p className="text-white/70 text-lg mb-12">
                Nous croyons en une tarification transparente. Nos estimations sont basées sur le Taux Journalier Moyen (TJM) du marché,
                multiplié par la complexité (temps requis) et le niveau d'urgence.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={100}>
              <div className="bg-[#f3f3f6] h-full rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">Marché & Devise</h3>
                <p className="text-muted-foreground">
                  Nos TJM sont ajustés selon les réalités économiques locales (Afrique Centrale) ou internationales.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-[#f3f3f6] h-full rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-primary/50" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">Envergure du Projet</h3>
                <p className="text-muted-foreground">
                  La complexité détermine le nombre de jours nécessaires à notre équipe pour livrer un travail d'excellence.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-[#f3f3f6] h-full rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-600/30 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">Niveau d'Urgence</h3>
                <p className="text-muted-foreground">
                  Les services urgents nécessitent de réallouer nos ressources rapidement, impactant la tarification globale.
                </p>
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

export default QuoteCalculator;