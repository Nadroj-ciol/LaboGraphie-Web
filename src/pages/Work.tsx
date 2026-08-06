import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LocalizedLink as Link } from "@/components/LocalizedLink";

// Import existing images for works
import work1 from "@/assets/work-1.png";
import work2 from "@/assets/work-2.png";
import work3 from "@/assets/work-3.png";
import work4 from "@/assets/work-4.png";
import work5 from "@/assets/work-5.png";
import work6 from "@/assets/work-6.png";

const works = [
  {
    slug: "identite-visuelle-novatech",
    image: work1,
    title: "Identité Visuelle Novatech",
    description: "Création complète d'une identité de marque : logo, charte graphique et supports de communication pour une startup tech en pleine croissance à Douala."
  },
  {
    slug: "plateforme-ecommerce-candace",
    image: work2,
    title: "Plateforme E-commerce Candace",
    description: "Conception et développement d'une boutique en ligne moderne avec paiement mobile money, gestion de stock et tableau de bord administrateur."
  },
  {
    slug: "application-gestion-petittri",
    image: work3,
    title: "Application de Gestion PetitTri",
    description: "Développement d'une application mobile de gestion de tri des déchets, incluant géolocalisation, notifications et interface intuitive pour les usagers."
  },
  {
    slug: "refonte-site-institutionnel",
    image: work4,
    title: "Refonte Site Institutionnel",
    description: "Refonte complète du site web d'une institution publique : nouvelle arborescence, design responsive et optimisation SEO pour une meilleure visibilité."
  },
  {
    slug: "audit-cybersecurite",
    image: work5,
    title: "Audit de Cybersécurité",
    description: "Audit approfondi de l'infrastructure numérique d'une entreprise, identification des vulnérabilités et mise en place de mesures de protection renforcées."
  },
  {
    slug: "campagne-social-media",
    image: work6,
    title: "Campagne Social Media",
    description: "Stratégie et gestion de campagnes sur les réseaux sociaux pour une marque locale, avec création de contenu et augmentation significative de l'engagement."
  }
];

const Work = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Work Cards */}
      <section className="pt-20 lg:pt-32 bg-white">
        <div className="container-custom section-padding">
          {/* Breadcrumb */}
          <div className="text-muted-foreground text-sm mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">Réalisations</span>
          </div>

          {/* Header */}
          <div className="flex max-md:flex-col gap-8 mb-16 justify-between">
            <h1 className="text-black text-7xl font-bold">Nos Réalisations</h1>
            <p className="text-muted-foreground max-w-[468px] text-lg font-medium lg:pt-4">
              Des solutions digitales sur-mesure pensées pour répondre aux besoins de nos clients au Cameroun et en Afrique.
            </p>
          </div>

          {/* Work Cards Grid - 2 columns */}
          <div className="grid md:grid-cols-2 gap-8 gap-y-16">
            {works.map((work, index) => (
              <FadeIn key={index} delay={index * 100}>
                <Link to={`/work/${work.slug}`} className="group cursor-pointer block">
                  {/* Image */}
                  <div className="overflow-hidden rounded-2xl mb-6">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <h5 className="text-black text-4xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {work.title}
                  </h5>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {work.description}
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
