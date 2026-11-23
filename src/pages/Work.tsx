import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useTranslation } from "react-i18next";

// Import existing images for works
import work1 from "@/assets/real-branding-3d.webp";
import work2 from "@/assets/real-work-candace.webp";
import work3 from "@/assets/real-dev-erp.webp";
import work4 from "@/assets/real-dev-web.webp";
import work5 from "@/assets/real-cybersecurity.webp";
import work6 from "@/assets/real-work-social-fosaa.webp";

const WORK_IMAGES: Record<string, string> = {
  "identite-visuelle-novatech": work1,
  "plateforme-ecommerce-candace": work2,
  "application-gestion-petittri": work3,
  "refonte-site-institutionnel": work4,
  "audit-cybersecurite": work5,
  "campagne-social-media": work6,
};
const WORK_SLUGS = Object.keys(WORK_IMAGES);

const Work = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Work Cards */}
      <section className="pt-20 lg:pt-32 bg-background">
        <div className="container-custom section-padding">
          {/* Breadcrumb */}
          <div className="text-muted-foreground text-sm mb-4">
            <Link to="/" className="hover:text-primary transition-colors">{t("common.nav.home")}</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{t("common.nav.work")}</span>
          </div>

          {/* Header */}
          <div className="flex max-md:flex-col gap-8 mb-16 justify-between">
            <h1 className="text-foreground text-7xl font-bold">{t("work.page.title")}</h1>
            <p className="text-muted-foreground max-w-[468px] text-lg font-medium lg:pt-4">
              {t("work.page.description")}
            </p>
          </div>

          {/* Work Cards Grid - 2 columns */}
          <div className="grid md:grid-cols-2 gap-8 gap-y-16">
            {WORK_SLUGS.map((slug, index) => (
              <FadeIn key={slug} delay={index * 100}>
                <Link to={`/work/${slug}`} className="group cursor-pointer block">
                  {/* Image */}
                  <div className="overflow-hidden rounded-2xl mb-6">
                    <img
                      src={WORK_IMAGES[slug]}
                      alt={t(`work.items.${slug}.title`)}
                      className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <h5 className="text-foreground text-4xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {t(`work.items.${slug}.title`)}
                  </h5>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {t(`work.items.${slug}.description`)}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      <CTA />

      <Footer />
    </div>
  );
};

export default Work;
