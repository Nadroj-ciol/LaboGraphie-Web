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
import { useTranslation } from "react-i18next";
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

const SERVICE_IMAGES: Record<string, string> = {
  "design-branding": service1,
  "developpement-web": service2,
  "marketing-digital": service3,
  "cybersecurite": service4,
  "formations-pro": service5,
  "maintenance-it": service6,
};
const SERVICE_SLUGS = Object.keys(SERVICE_IMAGES);

// Validation schemas
const nameSchema = z.string().trim().min(1, "Le nom est requis").max(100, "Le nom doit contenir moins de 100 caractères");
const phoneSchema = z.string().trim().min(1, "Le téléphone est requis").max(20, "Le téléphone doit contenir moins de 20 caractères");

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
        <span className="block transition-transform duration-300 group-hover:-translate-y-full text-primary-foreground font-semibold">
          {children}
        </span>
        <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full text-primary-foreground font-semibold">
          {children}
        </span>
      </span>
    </button>
  );
};

interface WorkStep {
  title: string;
  description: string;
}

const ServiceDetail = () => {
  const { t } = useTranslation();
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug && SERVICE_SLUGS.includes(rawSlug) ? rawSlug : "developpement-web";

  const service = {
    slug,
    image: SERVICE_IMAGES[slug],
    title: t(`services.items.${slug}.title`),
    description: t(`services.items.${slug}.description`),
    aboutTitle: t(`services.items.${slug}.aboutTitle`),
    aboutDescription: t(`services.items.${slug}.aboutDescription`),
    included: t(`services.items.${slug}.included`, { returnObjects: true }) as string[],
    benefits: t(`services.items.${slug}.benefits`, { returnObjects: true }) as string[],
    workSteps: t(`services.items.${slug}.workSteps`, { returnObjects: true }) as WorkStep[],
  };

  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedService, setSelectedService] = useState(slug);
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

    const serviceName = t(`services.items.${selectedService}.title`);

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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Service Title Section */}
      <section className="bg-transparent py-12">
        <div className="container-custom section-padding py-12">
          {/* Breadcrumb */}
          <div className="text-muted-foreground text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">{t("common.nav.home")}</Link>
            <span className="mx-2">/</span>
            <Link to="/services" className="hover:text-primary transition-colors">{t("common.nav.services")}</Link>
          </div>

          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-4">
              <h2 className="text-foreground text-5xl md:text-7xl font-bold">{service.title}</h2>
              <Link to="/quote">
                <FlipButton variant="primary">{t("services.detail.requestQuote")}</FlipButton>
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
                <p className="text-primary font-semibold mb-4">{t("services.detail.serviceDetailsLabel")}</p>
                <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{service.aboutTitle}</h3>
              </FadeIn>

              <FadeIn delay={100}>
                <div className="text-muted-foreground font-medium leading-relaxed mb-8 whitespace-pre-line">
                  {service.aboutDescription}
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <h4 className="text-2xl font-bold text-foreground mb-4">{t("services.detail.whatsIncluded")}</h4>
                <div className="space-y-4">
                  {service.included.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
              <section className=" py-16 lg:py-32">
                <div className="container-custom">
                  <FadeIn>
                    <p className="text-primary font-bold mb-4">{t("services.detail.ourMethod")}</p>
                    <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("services.detail.howWeWork")}</h3>
                    <p className="text-muted-foreground max-w-2xl mb-12">
                      {t("services.detail.methodDescription")}
                    </p>
                  </FadeIn>

                  <div className="grid md:grid-cols-2 gap-12">
                    {service.workSteps.map((step, index) => (
                      <FadeIn key={index} delay={index * 100}>
                        <div className="flex flex-col gap-4">
                          <div className="w-14 h-14 rounded-full border border-secondary flex items-center justify-center flex-shrink-0">
                            <span className="text-secondary font-bold">{String(index + 1).padStart(2, "0")}</span>
                          </div>
                          <div>
                            <h5 className="text-2xl font-bold text-foreground mb-2">{step.title}</h5>
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
                        <p className="text-primary font-bold mb-4">{t("services.detail.advantagesLabel")}</p>
                        <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{t("services.detail.serviceAdvantages")}</h3>
                        <p className="text-muted-foreground font-medium mb-8">
                          {t("services.detail.advantagesDescription")}
                        </p>
                      </FadeIn>

                      <FadeIn delay={100}>
                        <div className="space-y-4">
                          {service.benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                                <Check className="w-3 h-3 text-primary-foreground" />
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
                          alt={t("services.detail.advantagesImageAlt")}
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
                <div className="bg-muted p-8 rounded-xl">
                  <h4 className="text-3xl font-bold text-foreground mb-6">{t("services.detail.contactUs")}</h4>

                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div>
                      <label className=" font-bold text-foreground mb-2 block">{t("services.detail.fullName")}</label>
                      <Input
                        className="bg-transparent h-12"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t("services.detail.fullNamePlaceholder")}
                      />
                      {errors.fullName && (
                        <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className=" font-bold text-foreground mb-2 block">{t("services.detail.phone")}</label>
                      <Input
                        className="bg-transparent border-border h-12"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t("services.detail.phonePlaceholder")}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className=" font-bold text-foreground mb-2 block">{t("services.detail.chooseService")}</label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="bg-transparent h-12 border-border">
                          <SelectValue placeholder={t("services.detail.chooseServicePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_SLUGS.map((s) => (
                            <SelectItem key={s} value={s}>{t(`services.items.${s}.title`)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className=" font-bold text-foreground mb-2 block">{t("services.detail.message")}</label>
                      <Textarea
                        placeholder={t("services.detail.messagePlaceholder")}
                        className="bg-transparent border-border min-h-[100px]"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-secondary/90 text-primary-foreground py-6"
                      disabled={createInquiry.isPending}
                    >
                      {createInquiry.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("services.detail.sending")}
                        </>
                      ) : (
                        t("services.detail.send")
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
