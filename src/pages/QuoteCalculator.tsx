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
import { Slider } from "@/components/ui/slider";
import { services } from "@/data/services";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCreateQuoteRequest } from "@/hooks/useQuoteRequests";
import { Calendar, Calculator, Check, Clock, DollarSign, Phone, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const formatFCFA = (amount: number) => `${Math.round(amount).toLocaleString("fr-FR").replace(/,/g, " ")} FCFA`;

export interface QuoteData {
  serviceSlug: string;
  serviceTitle: string;
  complexityLabel: string;
  complexityMultiplier: number;
  estimatedHours: number;
  urgency: "standard" | "urgent" | "emergency";
  basePrice: number;
  estimatedMin: number;
  estimatedMax: number;
}

const QuoteCalculator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id);
  const createQuoteMutation = useCreateQuoteRequest();
  
  const [selectedService, setSelectedService] = useState<string>("");
  const [complexity, setComplexity] = useState<number>(0);
  const [estimatedHours, setEstimatedHours] = useState<number[]>([2]);
  const [urgency, setUrgency] = useState<"standard" | "urgent" | "emergency">("standard");
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
    if (!service) return { min: 0, max: 0 };

    const baseRate = service.basePrice;
    const complexityMultiplier = service.complexityOptions[complexity]?.multiplier || 1;
    const hours = estimatedHours[0];
    const urgencyMult = urgencyMultiplier[urgency];

    const baseEstimate = baseRate * complexityMultiplier * hours * urgencyMult;

    return {
      min: Math.round(baseEstimate * 0.9),
      max: Math.round(baseEstimate * 1.1),
    };
  };

  const estimate = calculateEstimate();

  const handleRequestQuote = async () => {
    if (!service) return;

    // Validate phone number
    if (user && !phone.trim()) {
      toast.error("Veuillez saisir votre numéro de téléphone");
      return;
    }

    // If user is logged in, save directly to database
    if (user) {
      setIsSubmitting(true);
      try {
        await createQuoteMutation.mutateAsync({
          user_id: user.id,
          full_name: profile?.full_name || user.email?.split("@")[0] || "User",
          phone: phone.trim(),
          email: user.email || null,
          service_slug: service.slug,
          service_title: service.title,
          complexity_label: service.complexityOptions[complexity]?.label || "",
          complexity_multiplier: service.complexityOptions[complexity]?.multiplier || 1,
          estimated_hours: estimatedHours[0],
          urgency,
          base_price: service.basePrice,
          estimated_min: estimate.min,
          estimated_max: estimate.max,
          notes: null,
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

    // If not logged in, navigate to contact form
    const quoteData: QuoteData = {
      serviceSlug: service.slug,
      serviceTitle: service.title,
      complexityLabel: service.complexityOptions[complexity]?.label || "",
      complexityMultiplier: service.complexityOptions[complexity]?.multiplier || 1,
      estimatedHours: estimatedHours[0],
      urgency,
      basePrice: service.basePrice,
      estimatedMin: estimate.min,
      estimatedMax: estimate.max,
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
              Utilisez notre calculateur de devis pour obtenir une estimation instantanée de votre projet digital.
              Sélectionnez votre service, le niveau de complexité, et obtenez une fourchette de prix en quelques secondes.
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
                  {/* Service Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-black">
                      Sélectionner un Service
                    </Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="h-14 text-base text-black bg-white">
                        <SelectValue placeholder="Choisissez un service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.slug} value={s.slug} className="text-base">
                            <div className="flex items-center gap-3">
                              <span>{s.title}</span>
                              <span className="text-muted-foreground">
                                (à partir de {formatFCFA(s.basePrice)})
                              </span>
                            </div>
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
                          Complexité du Projet
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
                                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
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

                  {/* Estimated Hours */}
                  {service && (
                    <FadeIn delay={100}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium text-black">
                            Durée Estimée (jours)
                          </Label>
                          <span className="text-2xl font-bold text-primary">
                            {estimatedHours[0]} j
                          </span>
                        </div>
                        <Slider
                          value={estimatedHours}
                          onValueChange={setEstimatedHours}
                          min={1}
                          max={10}
                          step={0.5}
                          className="py-4"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>1 jour</span>
                          <span>10 jours</span>
                        </div>
                      </div>
                    </FadeIn>
                  )}

                  {/* Urgency Selection */}
                  {service && (
                    <FadeIn delay={200}>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-black`">
                          Urgence du Projet
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => setUrgency("standard")}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${urgency === "standard"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                              }`}
                          >
                            <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                            <p className="font-semibold text-sm text-primary">Standard</p>
                            <p className="text-xs text-muted-foreground">Tarif x1</p>
                          </button>
                          <button
                            onClick={() => setUrgency("urgent")}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${urgency === "urgent"
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                              }`}
                          >
                            <Clock className="w-5 h-5 mx-auto mb-2 text-yellow-600" />
                            <p className="font-semibold text-sm text-primary">Urgent</p>
                            <p className="text-xs text-muted-foreground">Tarif x1,25</p>
                          </button>
                          <button
                            onClick={() => setUrgency("emergency")}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${urgency === "emergency"
                              ? "border-destructive bg-destructive/5"
                              : "border-border hover:border-destructive/50"
                              }`}
                          >
                            <Clock className="w-5 h-5 mx-auto mb-2 text-destructive" />
                            <p className="font-semibold text-sm text-primary">Urgence</p>
                            <p className="text-xs text-muted-foreground">Tarif x1,5</p>
                          </button>
                        </div>
                      </div>
                    </FadeIn>
                  )}

                  {/* Phone Number - Only for logged in users */}
                  {service && user && (
                    <FadeIn delay={300}>
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
                    <FadeIn delay={400}>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-black">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Date de Prestation Souhaitée
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
                        <p className="text-3xl md:text-4xl font-bold">
                          {formatFCFA(estimate.min)} - {formatFCFA(estimate.max)}
                        </p>
                      </div>

                      <div className="border-t border-white/20 pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <Wrench className="w-5 h-5 text-accent" />
                          <div>
                            <p className="font-medium">{service.title}</p>
                            <p className="text-sm text-primary-foreground/70">
                              {service.complexityOptions[complexity]?.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-accent" />
                          <p className="font-medium">{estimatedHours[0]} jours estimés</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-accent" />
                          <p className="font-medium capitalize">Service {urgency === "standard" ? "standard" : urgency === "urgent" ? "urgent" : "en urgence"}</p>
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
                          *Ceci est une estimation. Le prix final peut varier après étude du projet.
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

                {/* Service Price List */}
                <div className="bg-[#f3f3f6] rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-black">Tarifs de Base</h3>
                  <div className="space-y-3">
                    {services.map((s) => (
                      <div
                        key={s.slug}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${selectedService === s.slug ? "bg-primary/10" : "hover:bg-primary/10"
                          }`}
                      >
                        <span className="text-sm font-medium text-black">{s.title}</span>
                        <span className="text-sm font-bold text-primary">{formatFCFA(s.basePrice)}</span>
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
                Nous croyons en une tarification transparente. Nos estimations sont basées sur le type de service,
                la complexité du projet, le temps requis et le niveau d'urgence.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={100}>
              <div className="bg-[#f3f3f6] h-full rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">Type de Service</h3>
                <p className="text-muted-foreground">
                  Chaque service dispose d'un tarif de base différent selon l'expertise et les outils
                  nécessaires.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-[#f3f3f6] h-full rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-primary/50" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">Complexité du Projet</h3>
                <p className="text-muted-foreground">
                  Les projets plus complexes demandent davantage de temps, de ressources et de compétences spécialisées.
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
                  Les services urgents sont disponibles 24/7 avec une tarification adaptée pour
                  une réponse immédiate.
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