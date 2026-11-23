import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Check, CheckCircle2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useParams } from "react-router-dom";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useTranslation } from "react-i18next";

// Import images
import novatechWork from "@/assets/real-branding-3d.webp";
import candaceWork from "@/assets/real-work-candace.webp";
import petittriWork from "@/assets/service-web-mobile.webp";
import cybersecurityWork from "@/assets/work-cybersecurity-audit.webp";
import heroGrid1 from "@/assets/real-work-acuvera.webp";
import heroGrid2 from "@/assets/real-design-branding.webp";
import heroGrid3 from "@/assets/service-web-mobile.webp";
import heroGrid4 from "@/assets/real-work-social-fosaa.webp";
import problem1 from "@/assets/studio-team-hero.webp";
import problem2 from "@/assets/real-service-marketing.webp";
import solution1 from "@/assets/real-work-acuvera.webp";
import solution2 from "@/assets/service-design-branding.webp";

const WORK_IMAGES: Record<string, string> = {
  "identite-visuelle-novatech": novatechWork,
  "plateforme-ecommerce-candace": candaceWork,
  "application-gestion-petittri": petittriWork,
  "refonte-site-institutionnel": heroGrid1,
  "audit-cybersecurite": cybersecurityWork,
  "campagne-social-media": heroGrid4,
};

interface WorkStep {
  title: string;
  description: string;
}

const WorkDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const image = slug ? WORK_IMAGES[slug] : undefined;

  if (!image || !slug) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t("work.detail.notFoundTitle")}</h1>
          <Link to="/work" className="text-primary hover:underline">
            {t("work.detail.backToWork")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const work = {
    image,
    title: t(`work.items.${slug}.title`),
    description: t(`work.items.${slug}.description`),
    detailTitle: t(`work.items.${slug}.detailTitle`),
    detailDescription: t(`work.items.${slug}.detailDescription`),
    overview: t(`work.items.${slug}.overview`, { returnObjects: true }) as string[],
    client: t(`work.items.${slug}.client`),
    budget: t(`work.items.${slug}.budget`),
    services: t(`work.items.${slug}.servicesUsed`),
    location: t(`work.items.${slug}.location`),
    date: t(`work.items.${slug}.date`),
    workSteps: t(`work.items.${slug}.workSteps`, { returnObjects: true }) as WorkStep[],
    problems: t(`work.items.${slug}.problems`, { returnObjects: true }) as string[],
    solutions: t(`work.items.${slug}.solutions`, { returnObjects: true }) as string[],
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 lg:pt-32 bg-card">
        <div className="container-custom section-padding">
          {/* Breadcrumb */}
          <FadeIn>
            <div className="text-muted-foreground text-sm mb-4 text-center">
              <Link to="/" className="hover:text-primary transition-colors">{t("common.nav.home")}</Link>
              <span className="mx-2">/</span>
              <Link to="/work" className="hover:text-primary transition-colors">{t("common.nav.work")}</Link>
            </div>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={100}>
            <h1 className="text-foreground font-bold text-center mb-4">{work.title}</h1>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={200}>
            <p className="text-muted-foreground font-medium text-center max-w-2xl mx-auto mb-12">
              {work.description}
            </p>
          </FadeIn>

          {/* Hero Image */}
          <FadeIn delay={300}>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Work Details Section */}
      <section className="bg-card">
        <div className="container-custom pt-20 section-padding">
          <div className="grid lg:grid-cols-3 gap-0">
            {/* Left Content */}
            <div className="lg:col-span-2 max-w-[640px]">
              <FadeIn>
                <span className="text-primary font-bold uppercase tracking-wider">
                  {t("work.detail.projectDetailsLabel")}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
                  {work.detailTitle}
                </h2>
                <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                  {work.detailDescription}
                </p>
              </FadeIn>

              <FadeIn delay={100}>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t("work.detail.overview")}</h3>
                <p className="text-muted-foreground font-medium mb-6">
                  {t("work.detail.overviewIntro")}
                </p>
              </FadeIn>

              <FadeIn delay={200}>
                <ul className="space-y-4">
                  {work.overview.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 min-w-[460px] -translate-x-[55px]">
              <FadeIn delay={300}>
                <div className="bg-muted rounded-2xl p-8 shadow-sm">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-foreground text-2xl font-bold">{t("work.detail.client")}</span>
                      <p className="text-muted-foreground font-semibold">{work.client}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-foreground text-2xl font-bold">{t("work.detail.budget")}</span>
                      <p className="text-muted-foreground font-semibold">{work.budget}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-foreground text-2xl font-bold">{t("work.detail.servicesLabel")}</span>
                      <p className="text-muted-foreground font-semibold">{work.services}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-foreground text-2xl font-bold">{t("work.detail.location")}</span>
                      <p className="text-muted-foreground font-semibold">{work.location}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-foreground text-2xl font-bold">{t("work.detail.date")}</span>
                      <p className="text-muted-foreground font-semibold">{work.date}</p>
                    </div>

                    <div>
                      <span className="text-foreground text-2xl font-bold block mb-3">{t("work.detail.share")}</span>
                      <div className="flex gap-3">
                        <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-secondary/90 transition-colors">
                          <Facebook className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-secondary/90 transition-colors">
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-secondary/90 transition-colors">
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-secondary/90 transition-colors">
                          <Instagram className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card lg:py-32 pb-8 lg:pb-16">
        <div className="grid gap-12 lg:grid-cols-2 container-custom section-padding">
          {/* Left - 2x2 Image Grid */}
          <div className="flex gap-8 h-fit">
            <div className="flex flex-col gap-4">
              <FadeIn delay={100}>
                <div className="rounded-xl overflow-hidden mt-12 h-[320px]">
                  <img
                    src={heroGrid1}
                    alt="Étape du projet 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="rounded-xl overflow-hidden h-[280px]">
                  <img
                    src={heroGrid2}
                    alt="Étape du projet 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
            </div>
            <div className="flex flex-col gap-4">
              <FadeIn delay={100}>
                <div className="rounded-xl overflow-hidden h-[290px]">
                  <img
                    src={heroGrid3}
                    alt="Étape du projet 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="rounded-xl overflow-hidden h-[310px]">
                  <img
                    src={heroGrid4}
                    alt="Étape du projet 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <FadeIn>
              <p className="text-primary font-bold mb-4">{t("work.detail.ourMethod")}</p>
              <h3 className="text-4xl md:text-5xl font-bold text-secondary mb-4">{t("work.detail.process")}</h3>
              <p className="text-muted-foreground max-w-2xl mb-12">
                {t("work.detail.processDescription")}
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
              {work.workSteps.map((step, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="flex flex-col gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-lg font-bold">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-secondary mb-2">{step.title}</h5>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-card lg:py-16 pb-8 lg:pb-16">
        <div className="container-custom section-padding">
          <div className="flex justify-center flex-col items-center w-full mb-20">
            <h2 className="text-foreground font-bold mb-4">{t("work.detail.problemAndSolution")}</h2>
            <p className="text-muted-foreground font-medium text-center max-w-2xl">{t("work.detail.problemAndSolutionIntro")}</p>
          </div>

          <div className="space-y-24">

            <FadeIn>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                <div>
                  <h3 className="text-foreground font-bold mb-4">{t("work.detail.problem")}</h3>
                  <p className="text-muted-foreground mb-8 font-semibold text-justify leading-relaxed">
                    {t("work.detail.problemIntro")}
                  </p>
                  <ul className="space-y-4">
                    {work.problems.map((problem, index) => <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                      <span className="text-muted-foreground text-lg">{problem}</span>
                    </li>)}
                  </ul>
                </div>
                {/* Right - Image */}
                <FadeIn className="h-[90%]">
                  <div className="relative h-full">
                    <div className="rounded-3xl h-full overflow-hidden">
                      <img src={problem1} alt="Équipe LaboGraphie au travail" className="h-full object-cover" />
                    </div>
                    {/* Experience Badge */}
                    <div className="absolute -bottom-12 w-[240px] h-[240px] -left-12 border-8 border-background overflow-hidden rounded-xl text-white">
                      <img src={problem2} alt="Équipe LaboGraphie au travail" className="h-full object-cover " />
                    </div>
                  </div>
                </FadeIn>
              </div>
            </FadeIn>
            {/* Solutions */}
            <FadeIn>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left - Image */}
                <FadeIn>
                  <div className="relative">
                    <div className="rounded-3xl overflow-hidden">
                      <img src={solution1} alt="Équipe LaboGraphie au travail" className="w-full h-auto object-cover" />
                    </div>
                    {/* Experience Badge */}
                    <div className="absolute -bottom-12 w-[240px] h-[240px] -right-12 border-8 border-background overflow-hidden rounded-xl text-white">
                      <img src={solution2} alt="Équipe LaboGraphie au travail" className="h-full object-cover " />
                    </div>
                  </div>
                </FadeIn>
                <div>
                  <h3 className="text-foreground font-bold mb-4">{t("work.detail.solutions")}</h3>
                  <p className="text-muted-foreground mb-8 font-semibold text-justify leading-relaxed">
                    {t("work.detail.solutionsIntro")}
                  </p>
                  <ul className="space-y-4">
                    {work.solutions.map((solution, index) => <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                      <span className="text-muted-foreground text-lg">{solution}</span>
                    </li>)}
                  </ul>
                </div>
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

export default WorkDetail;
