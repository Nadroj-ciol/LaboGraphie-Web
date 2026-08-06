import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { site } from "@/data/site";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container-custom mx-auto section-padding text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span>/</span>
              <span className="text-primary">Confidentialité</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-muted-foreground font-medium">
              Dernière mise à jour : 15 novembre 2023
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
                  Chez {site.name}, laboratoire & cabinet digital basé à {site.address}, nous accordons une
                  grande importance à la protection de vos données personnelles. Cette politique de
                  confidentialité décrit les informations que nous collectons, la manière dont nous les
                  utilisons et les droits dont vous disposez, conformément à la législation camerounaise
                  en vigueur sur la protection des données.
                </p>
              </div>

              {/* Quelles informations nous collectons */}
              <div>
                <h2 className="text-4xl font-bold text-black mb-4">
                  Quelles informations nous collectons
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Lorsque vous utilisez notre site web, demandez un devis, postulez à une offre d'emploi
                    ou nous contactez, nous pouvons collecter certaines informations personnelles telles
                    que votre nom complet, votre adresse e-mail, votre numéro de téléphone, l'entreprise
                    pour laquelle vous travaillez et le contenu de vos demandes ou messages.
                  </p>
                  <p>
                    Nous pouvons également collecter des informations techniques, comme votre adresse IP,
                    le type de navigateur utilisé et vos interactions avec notre site, dans le but
                    d'améliorer nos services et votre expérience utilisateur.
                  </p>
                </div>
              </div>

              {/* Comment nous utilisons vos informations */}
              <div>
                <h2 className="text-4xl font-bold text-black mb-4">
                  Comment nous utilisons vos informations
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Les informations que vous nous fournissez sont utilisées exclusivement dans le cadre
                    de nos activités de laboratoire et cabinet digital, notamment pour :
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Traiter vos demandes de devis et vous fournir nos services (branding, développement web, marketing digital, cybersécurité, formations)</li>
                    <li>Répondre à vos messages et demandes de contact</li>
                    <li>Étudier vos candidatures aux offres d'emploi publiées</li>
                    <li>Améliorer nos services et la performance de notre site web</li>
                  </ul>
                </div>
              </div>

              {/* Cookies et suivi */}
              <div>
                <h2 className="text-4xl font-bold text-black mb-4">
                  Cookies et Suivi
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Notre site utilise des cookies afin d'assurer son bon fonctionnement, de mesurer son
                    audience et d'améliorer votre expérience de navigation. Vous pouvez à tout moment
                    configurer votre navigateur pour refuser les cookies, sachant que certaines
                    fonctionnalités du site pourraient alors être limitées.
                  </p>
                  <p>
                    Nous ne revendons ni ne partageons vos données personnelles avec des tiers à des fins
                    commerciales sans votre consentement explicite.
                  </p>
                </div>
              </div>

              {/* Vos droits */}
              <div>
                <h2 className="text-4xl font-bold text-black mb-4">
                  Vos Droits
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition
                    concernant vos données personnelles détenues par {site.name}. Pour exercer ces droits,
                    vous pouvez nous contacter directement à l'adresse e-mail indiquée ci-dessous. Nous
                    nous engageons à traiter votre demande dans les meilleurs délais.
                  </p>
                </div>
              </div>

              {/* Contactez-nous */}
              <div>
                <h2 className="text-4xl font-bold text-black mb-4">
                  Contactez-Nous
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Pour toute question concernant cette politique de confidentialité ou le traitement de
                    vos données personnelles, vous pouvez nous contacter :
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Par e-mail : {site.email}</li>
                    <li>Par téléphone / WhatsApp : {site.phone}</li>
                    <li>À notre adresse : {site.address}</li>
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
