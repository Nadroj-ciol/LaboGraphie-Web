import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { services } from "@/data/services";
import { useServicePricing } from "@/hooks/usePricing";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  const { data: servicePricingData = [] } = useServicePricing();

  return <div className="min-h-screen">
    <Header />

    {/* Hero Section with Service Cards */}
    <section className="pt-20 bg-background">
      <div className="container-custom section-padding">
        {/* Breadcrumb */}
        <div className="text-muted-foreground text-sm mb-4">
          <Link to="/" className="hover:text-primary transition-colors">{t("common.nav.home")}</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{t("common.nav.services")}</span>
        </div>

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <h1 className="text-foreground text-7xl font-bold">{t("services.page.title")}</h1>
          <p className="text-muted-foreground text-lg lg:pt-4">
            {t("services.page.description")}
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const dynamicPricing = servicePricingData.find(p => p.slug === service.slug);
            const localTJM = dynamicPricing?.local_tjm ?? service.localTJM;

            return (
              <FadeIn key={index} delay={index * 100}>
                <Link to={`/services/${service.slug}`}>
                  <div className="group cursor-pointer transition-all bg-muted rounded-xl hover:bg-primary h-full px-[30px] py-[28px] duration-300">
                    {/* Image */}
                    <div className="overflow-hidden mb-6 rounded-md min-h-[340px] max-h-[340px]">
                      <img src={service.image} alt={t(`services.items.${service.slug}.title`)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-md" />
                    </div>

                    {/* Content */}
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-4xl duration-300 transition-all text-foreground group-hover:text-accent">
                        {t(`services.items.${service.slug}.title`)}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-primary group-hover:text-primary-foreground transition-colors duration-300">
                        {t("services.page.startingFrom", { price: localTJM.toLocaleString("fr-FR") })}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed transition-all duration-300 group-hover:text-primary-foreground">
                      {t(`services.items.${service.slug}.description`)}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>

    <CTA />
    <Footer />
  </div>;
};
export default Services;
