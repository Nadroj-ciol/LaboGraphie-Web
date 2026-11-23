import contact from "@/assets/contact-studio-consultation.webp";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/data/services";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useExchangeRates, DEFAULT_EXCHANGE_RATES } from "@/hooks/usePricing";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency, toCurrency } from "@/lib/currency";
import { Clock, DollarSign, Mail, MapPin, Phone, Wrench } from "lucide-react";
import { site } from "@/data/site";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { QuoteData } from "./QuoteCalculator";

const Contact = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id);

  const quoteData = location.state?.quoteData as QuoteData | undefined;
  const planData = location.state?.planData as { planName: string; planType: string; price: number; currency?: string } | undefined;
  const { data: exchangeRates = DEFAULT_EXCHANGE_RATES } = useExchangeRates();

  const contactInfo = [
    {
      icon: Mail,
      title: t("contact.writeUsTitle"),
      description: t("contact.writeUsDescription"),
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: MapPin,
      title: t("contact.visitUsTitle"),
      description: t("contact.visitUsDescription"),
      value: site.address,
      href: "https://www.google.com/maps/search/?api=1&query=Bastos,+Yaound%C3%A9,+Cameroun",
    },
    {
      icon: Phone,
      title: t("contact.callUsTitle"),
      description: t("contact.callUsDescription"),
      value: site.phone,
      href: site.phoneHref,
    },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    service: quoteData?.serviceSlug || "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form with user data when logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: profile?.full_name || prev.fullName,
        email: user.email || prev.email,
        phone: profile?.phone || prev.phone,
      }));
    }
  }, [user, profile]);

  useEffect(() => {
    if (quoteData) {
      setFormData(prev => ({
        ...prev,
        service: quoteData.serviceSlug,
      }));
    }
  }, [quoteData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone) {
      toast.error(t("contact.requiredFieldsError"));
      return;
    }

    setIsSubmitting(true);

    try {
      if (quoteData) {
        // Submit quote request to database
        const { error } = await supabase.from("quote_requests").insert({
          user_id: user?.id ?? null,
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email || null,
          service_slug: quoteData.serviceSlug,
          service_title: quoteData.serviceTitle,
          complexity_label: quoteData.complexityLabel,
          complexity_multiplier: quoteData.complexityMultiplier,
          estimated_hours: quoteData.estimatedHours,
          urgency: quoteData.urgency,
          base_price: quoteData.basePrice,
          estimated_min: quoteData.estimatedMin,
          estimated_max: quoteData.estimatedMax,
          currency: quoteData.currency,
          notes: formData.notes || null,
        });

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ["user_quotes"] });
        queryClient.invalidateQueries({ queryKey: ["quote_requests"] });
        toast.success(t("contact.quoteSuccess"));
        navigate("/contact", { replace: true, state: null });
      } else if (planData) {
        // Submit plan inquiry to database
        const { error } = await supabase.from("quote_requests").insert({
          user_id: user?.id ?? null,
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email || null,
          service_slug: `${planData.planType}-plan`,
          service_title: `${planData.planName} (${planData.planType})`,
          complexity_label: "Plan Inquiry",
          complexity_multiplier: 1,
          estimated_hours: 1,
          urgency: "standard",
          base_price: planData.price,
          estimated_min: planData.price,
          estimated_max: planData.price,
          currency: planData.currency || "FCFA",
          notes: formData.notes || null,
        });

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ["user_quotes"] });
        queryClient.invalidateQueries({ queryKey: ["quote_requests"] });
        toast.success(t("contact.genericSuccess"));
        navigate("/contact", { replace: true, state: null });
      } else {
        // Regular contact form - save to contacts table
        const { error } = await supabase.from("contacts").insert({
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email || null,
          service: formData.service || null,
          notes: formData.notes || null,
        });

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        toast.success(t("contact.messageSuccess"));
      }

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        service: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(t("contact.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container-custom mx-auto text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">{t("common.nav.home")}</Link>
              <span>/</span>
              <span className="text-primary">{t("contact.breadcrumbLabel")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {quoteData ? t("contact.titleQuote") : planData ? t("contact.titlePlan") : t("contact.titleDefault")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {quoteData
                ? t("contact.descriptionQuote")
                : planData
                  ? t("contact.descriptionPlan")
                  : t("contact.descriptionDefault")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Quote Summary (if coming from calculator or pricing) */}
      {(quoteData || planData) && (
        <section className="pb-8 px-4">
          <div className="container mx-auto section-padding">
            <FadeIn>
              <div className="max-w-4xl mx-auto bg-primary rounded-2xl p-6 text-primary-foreground">
                <h3 className="text-xl font-bold mb-4">
                  {quoteData ? t("contact.quoteSummaryTitle") : t("contact.planSummaryTitle")}
                </h3>
                {quoteData ? (
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-primary-foreground/70">{t("contact.service")}</p>
                        <p className="font-medium">{quoteData.serviceTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-primary-foreground/70">{t("contact.estimatedDelay")}</p>
                        <p className="font-medium">{quoteData.estimatedHours} {t("contact.days", { s: quoteData.estimatedHours > 1 ? "s" : "" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-primary-foreground/70">{t("contact.urgency")}</p>
                        <p className="font-medium capitalize">{quoteData.urgency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-primary-foreground/70">{t("contact.estimation")}</p>
                        <p className="font-bold text-lg">
                          {formatCurrency(quoteData.estimatedMin, toCurrency(quoteData.currency), exchangeRates)} - {formatCurrency(quoteData.estimatedMax, toCurrency(quoteData.currency), exchangeRates)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : planData ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-primary-foreground/70">{t("contact.planName")}</p>
                      <p className="font-medium">{planData.planName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70">{t("contact.planType")}</p>
                      <p className="font-medium capitalize">{planData.planType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70">{t("contact.rate")}</p>
                      <p className="font-bold text-lg">{planData.price.toLocaleString("fr-FR")} FCFA/h</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto section-padding">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 mx-auto">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={contact}
                  alt="Équipe LaboGraphie au travail"
                  className="w-full h-full object-cover min-h-[400px]"
                />
              </div>

              {/* Form */}
              <div className="bg-muted rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  {quoteData || planData ? t("contact.yourInfo") : t("contact.titleDefault")}
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="block font-medium text-foreground mb-2">
                      {t("contact.fullName")} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      className="bg-transparent h-12"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-foreground mb-2">
                      {t("contact.phone")} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="tel"
                      placeholder={t("contact.phonePlaceholder")}
                      className="bg-transparent border-border"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-foreground mb-2">
                      {t("contact.email")}
                    </label>
                    <Input
                      type="email"
                      placeholder={t("contact.emailPlaceholder")}
                      className="bg-transparent border-border"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {!quoteData && !planData && (
                    <div>
                      <label className="block font-medium text-foreground mb-2">
                        {t("contact.desiredService")}
                      </label>
                      <Select
                        value={formData.service}
                        onValueChange={(value) => setFormData({ ...formData, service: value })}
                      >
                        <SelectTrigger className="bg-transparent border-border">
                          <SelectValue placeholder={t("contact.chooseServicePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.slug} value={service.slug}>
                              {t(`services.items.${service.slug}.title`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <label className="block font-medium text-foreground mb-2">
                      {quoteData || planData ? t("contact.additionalNotes") : t("contact.message")}
                    </label>
                    <Textarea
                      placeholder={t("contact.messagePlaceholder")}
                      className="bg-transparent border-border min-h-[120px]"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:text-accent/80 text-primary-foreground py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("contact.sending")
                      : quoteData
                        ? t("contact.sendQuoteRequest")
                        : planData
                          ? t("contact.sendRequest")
                          : t("contact.send")}
                  </Button>
                </form>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-20 px-4">
        <div className="container-custom section-padding">
          <FadeIn>
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-muted rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {info.title}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {info.description}
                  </p>
                  <a
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {info.value}
                  </a>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
