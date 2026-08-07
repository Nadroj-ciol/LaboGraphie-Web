import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { site } from "@/data/site";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container-custom mx-auto section-padding text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">{t("common.nav.home")}</Link>
              <span>/</span>
              <span className="text-primary">{t("privacyPolicy.breadcrumbLabel")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {t("privacyPolicy.title")}
            </h1>
            <p className="text-muted-foreground font-medium">
              {t("privacyPolicy.lastUpdated")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
            <div className="space-y-12">
              {/* Introduction */}
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacyPolicy.intro", { name: site.name, address: site.address })}
                </p>
              </div>

              {/* Quelles informations nous collectons */}
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  {t("privacyPolicy.infoCollectedTitle")}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{t("privacyPolicy.infoCollectedP1")}</p>
                  <p>{t("privacyPolicy.infoCollectedP2")}</p>
                </div>
              </div>

              {/* Comment nous utilisons vos informations */}
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  {t("privacyPolicy.howWeUseTitle")}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{t("privacyPolicy.howWeUseIntro")}</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>{t("privacyPolicy.howWeUseItem1")}</li>
                    <li>{t("privacyPolicy.howWeUseItem2")}</li>
                    <li>{t("privacyPolicy.howWeUseItem3")}</li>
                    <li>{t("privacyPolicy.howWeUseItem4")}</li>
                  </ul>
                </div>
              </div>

              {/* Cookies et suivi */}
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  {t("privacyPolicy.cookiesTitle")}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{t("privacyPolicy.cookiesP1")}</p>
                  <p>{t("privacyPolicy.cookiesP2")}</p>
                </div>
              </div>

              {/* Vos droits */}
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  {t("privacyPolicy.rightsTitle")}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{t("privacyPolicy.rightsP1", { name: site.name })}</p>
                </div>
              </div>

              {/* Contactez-nous */}
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  {t("privacyPolicy.contactTitle")}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{t("privacyPolicy.contactIntro")}</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>{t("privacyPolicy.contactByEmail", { email: site.email })}</li>
                    <li>{t("privacyPolicy.contactByPhone", { phone: site.phone })}</li>
                    <li>{t("privacyPolicy.contactAddress", { address: site.address })}</li>
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
