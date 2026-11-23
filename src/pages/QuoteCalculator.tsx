import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useSearchParams } from "react-router-dom";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useServicePricing, useExchangeRates, DEFAULT_EXCHANGE_RATES } from "@/hooks/usePricing";
import { type Currency, formatCurrency } from "@/lib/currency";

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

interface ComplexityOptionText {
  label: string;
  description: string;
}

const QuoteCalculator = () => {
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();
  const { user, isAdmin } = useAuth();
  const { data: profile } = useUserProfile(user?.id);
  const createQuoteMutation = useCreateQuoteRequest();

  const { data: servicePricingData = [] } = useServicePricing();
  const { data: exchangeRates = DEFAULT_EXCHANGE_RATES } = useExchangeRates();

  const [searchParams] = useSearchParams();
  const initialServiceParam = searchParams.get("service") || "";
  const validInitialService = services.some((s) => s.slug === initialServiceParam) ? initialServiceParam : "";

  const [selectedService, setSelectedService] = useState<string>(validInitialService);
  const [complexity, setComplexity] = useState<number>(0);
  const [urgency, setUrgency] = useState<"standard" | "urgent" | "emergency">("standard");
  const [currency, setCurrency] = useState<Currency>("FCFA");
  const [phone, setPhone] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill phone from profile
  useEffect(() => {
    if (profile?.phone) {
      setPhone(profile.phone);
    }
  }, [profile]);

  const service = services.find((s) => s.slug === selectedService);
  const complexityTexts = service
    ? (t(`services.items.${service.slug}.complexityOptions`, { returnObjects: true }) as ComplexityOptionText[])
    : [];

  const urgencyMultiplier = {
    standard: 1,
    urgent: 1.25,
    emergency: 1.5,
  };

  const calculateEstimate = () => {
    if (!service) return { min: 0, max: 0, daysMin: 0, daysMax: 0, localTJM: 0, intlTJM: 0 };

    // Get pricing from dynamic DB data, fallback to static if not found
    const dynamicPricing = servicePricingData.find(p => p.slug === service.slug);
    const localTJM = dynamicPricing?.local_tjm ?? service.localTJM;
    const intlTJM = dynamicPricing?.intl_tjm ?? service.intlTJM;

    // Marché local (FCFA) vs International (EUR/USD)
    const tjm = currency === "FCFA" ? localTJM : intlTJM;

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
      localTJM,
      intlTJM
    };
  };

  const estimate = calculateEstimate();

  const handleRequestQuote = async () => {
    if (!service) return;

    if (user && !phone.trim()) {
      toast.error(t("quote.phoneRequired"));
      return;
    }

    const complexityLabel = complexityTexts[complexity]?.label || "";

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
          service_title: t(`services.items.${service.slug}.title`),
          complexity_label: complexityLabel,
          complexity_multiplier: 1,
          estimated_hours: avgDays, // Saving avg days instead of hours
          urgency,
          base_price: currency === "FCFA" ? estimate.localTJM : estimate.intlTJM,
          estimated_min: estimate.min,
          estimated_max: estimate.max,
          currency,
          notes: notes.trim() || null,
          service_date: serviceDate || null,
        });

        toast.success(t("quote.successSubmit"));
        navigate(isAdmin ? "/dashboard/quotes" : "/dashboard/my-quotes");
      } catch (error) {
        console.error("Error creating quote:", error);
        toast.error(t("quote.errorSubmit"));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const avgDays = Math.round((estimate.daysMin + estimate.daysMax) / 2);
    const quoteData: QuoteData = {
      serviceSlug: service.slug,
      serviceTitle: t(`services.items.${service.slug}.title`),
      complexityLabel,
      complexityMultiplier: 1,
      estimatedHours: avgDays,
      urgency,
      basePrice: currency === "FCFA" ? estimate.localTJM : estimate.intlTJM,
      estimatedMin: estimate.min,
      estimatedMax: estimate.max,
      currency,
    };

    navigate("/contact", { state: { quoteData } });
  };

  const urgencyServiceLabel = urgency === "standard" ? t("quote.serviceStandard") : urgency === "urgent" ? t("quote.serviceUrgent") : t("quote.serviceEmergency");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-card">
        <div className="container-custom section-padding text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                {t("common.nav.home")}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-primary font-medium">{t("quote.breadcrumbLabel")}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("quote.title")}
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t("quote.description")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-background">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calculator Form */}
            <FadeIn>
              <div className="bg-muted sticky top-6 h-max rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{t("quote.calculatorTitle")}</h2>
                </div>

                <div className="space-y-8">
                  {/* Currency Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground">
                      <Globe className="w-4 h-4 inline mr-2" />
                      {t("quote.currencyLabel")}
                    </Label>
                    <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                      <SelectTrigger className="h-14 text-base text-foreground bg-background">
                        <SelectValue placeholder={t("quote.currencyPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FCFA">{t("quote.currencyFcfa")}</SelectItem>
                        <SelectItem value="EUR">{t("quote.currencyEur")}</SelectItem>
                        <SelectItem value="USD">{t("quote.currencyUsd")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground">
                      {t("quote.serviceLabel")}
                    </Label>
                    <Select value={selectedService} onValueChange={(val) => {
                      setSelectedService(val);
                      setComplexity(0); // Reset complexity when service changes
                    }}>
                      <SelectTrigger className="h-14 text-base text-foreground bg-background">
                        <SelectValue placeholder={t("quote.servicePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.slug} value={s.slug} className="text-base">
                            {t(`services.items.${s.slug}.title`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Complexity Selection */}
                  {service && (
                    <FadeIn>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-foreground">
                          {t("quote.complexityLabel")}
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
                                  <p className="font-semibold text-foreground">{complexityTexts[index]?.label}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {complexityTexts[index]?.description}
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
                        <Label className="text-base font-medium text-foreground">
                          {t("quote.urgencyLabel")}
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
                            <p className="font-semibold text-sm text-primary">{t("quote.urgencyStandard")}</p>
                            <p className="text-xs text-muted-foreground">{t("quote.urgencyStandardRate")}</p>
                          </button>
                          <button
                            onClick={() => setUrgency("urgent")}
                            className={`p-3 lg:p-4 rounded-xl border-2 text-center transition-all ${urgency === "urgent"
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                              }`}
                          >
                            <Clock className="w-5 h-5 mx-auto mb-2 text-yellow-600" />
                            <p className="font-semibold text-sm text-primary">{t("quote.urgencyUrgent")}</p>
                            <p className="text-xs text-muted-foreground">{t("quote.urgencyUrgentRate")}</p>
                          </button>
                          <button
                            onClick={() => setUrgency("emergency")}
                            className={`p-3 lg:p-4 rounded-xl border-2 text-center transition-all ${urgency === "emergency"
                              ? "border-destructive bg-destructive/5"
                              : "border-border hover:border-destructive/50"
                              }`}
                          >
                            <Clock className="w-5 h-5 mx-auto mb-2 text-destructive" />
                            <p className="font-semibold text-sm text-primary">{t("quote.urgencyEmergency")}</p>
                            <p className="text-xs text-muted-foreground">{t("quote.urgencyEmergencyRate")}</p>
                          </button>
                        </div>
                      </div>
                    </FadeIn>
                  )}

                  {/* Phone Number - Only for logged in users */}
                  {service && user && (
                    <FadeIn delay={200}>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-foreground">
                          <Phone className="w-4 h-4 inline mr-2" />
                          {t("quote.phoneLabel")}
                        </Label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+237 6XX XX XX XX"
                          className="h-14 text-base text-foreground bg-background"
                        />
                      </div>
                    </FadeIn>
                  )}

                  {/* Service Date - Only for logged in users */}
                  {service && user && (
                    <FadeIn delay={300}>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-foreground">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          {t("quote.dateLabel")}
                        </Label>
                        <Input
                          type="date"
                          value={serviceDate}
                          onChange={(e) => setServiceDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="h-14 text-base text-foreground bg-background"
                        />
                      </div>
                    </FadeIn>
                  )}

                  {/* Project Notes - Only for logged in users */}
                  {service && user && (
                    <FadeIn delay={350}>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-foreground">
                          {t("contact.additionalNotes")}
                        </Label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={t("contact.messagePlaceholder")}
                          rows={3}
                          className="text-base text-foreground bg-background resize-none"
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
                    <h2 className="text-2xl font-bold">{t("quote.estimateTitle")}</h2>
                  </div>

                  {service ? (
                    <div className="space-y-6">
                      <div>
                        <p className="text-primary-foreground/70 mb-2">{t("quote.priceRangeLabel")}</p>
                        <p className="text-3xl lg:text-4xl font-bold text-white">
                          {formatCurrency(estimate.min, currency, exchangeRates)} - {formatCurrency(estimate.max, currency, exchangeRates)}
                        </p>
                      </div>

                      <div className="border-t border-white/20 pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <Wrench className="w-5 h-5 text-accent shrink-0" />
                          <div>
                            <p className="font-medium text-white">{t(`services.items.${service.slug}.title`)}</p>
                            <p className="text-sm text-primary-foreground/70">
                              {complexityTexts[complexity]?.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-accent shrink-0" />
                          <p className="font-medium text-white">{t("quote.estimatedTime", { min: estimate.daysMin, max: estimate.daysMax })}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-accent shrink-0" />
                          <p className="font-medium capitalize text-white">
                            {urgencyServiceLabel}
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
                          {isSubmitting ? t("quote.sending") : t("quote.requestOfficialQuote")}
                        </Button>
                        <p className="text-center text-sm text-primary-foreground/60 mt-3">
                          {t("quote.disclaimer")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calculator className="w-16 h-16 mx-auto mb-4 text-primary-foreground/30" />
                      <p className="text-xl font-medium text-primary-foreground/70">
                        {t("quote.selectServicePrompt")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Service Price List (TJM) */}
                <div className="bg-muted rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-foreground">{t("quote.tjmTitle")}</h3>
                  <div className="space-y-3">
                    {services.map((s) => {
                      const dyn = servicePricingData.find(p => p.slug === s.slug);
                      const tLoc = dyn?.local_tjm ?? s.localTJM;
                      const tIntl = dyn?.intl_tjm ?? s.intlTJM;
                      return (
                        <div
                          key={s.slug}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all ${selectedService === s.slug ? "bg-primary/10" : "hover:bg-primary/10"
                            }`}
                        >
                          <span className="text-sm font-medium text-foreground">{t(`services.items.${s.slug}.title`)}</span>
                          <span className="text-sm font-bold text-primary">
                            {formatCurrency(currency === "FCFA" ? tLoc : tIntl, currency, exchangeRates)} {t("quote.perDay")}
                          </span>
                        </div>
                      )
                    })}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
                {t("quote.howItWorksTitle")}
              </h2>
              <p className="text-white/70 text-lg mb-12">
                {t("quote.howItWorksDescription")}
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={100}>
              <div className="bg-muted h-full rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{t("quote.feature1Title")}</h3>
                <p className="text-muted-foreground">
                  {t("quote.feature1Description")}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-muted h-full rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-primary/50" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{t("quote.feature2Title")}</h3>
                <p className="text-muted-foreground">
                  {t("quote.feature2Description")}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-muted h-full rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-600/30 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{t("quote.feature3Title")}</h3>
                <p className="text-muted-foreground">
                  {t("quote.feature3Description")}
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
