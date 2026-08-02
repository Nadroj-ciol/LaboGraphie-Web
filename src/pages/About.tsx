import plumberTeam from "@/assets/about-hero-1.png";
import mission from "@/assets/mission-1.png";
import vision from "@/assets/mission-2.png";
import profile1 from "@/assets/profile-1.png";
import profile2 from "@/assets/profile-2.png";
import profile3 from "@/assets/profile-3.png";
import heroGrid1 from "@/assets/timeline-1.png";
import heroGrid2 from "@/assets/timeline-2.png";
import heroGrid3 from "@/assets/timeline-3.png";
import heroGrid4 from "@/assets/timeline-4.png";
import CounterAnimation from "@/components/CounterAnimation";
import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCareers } from "@/hooks/useCareers";
import { ArrowUpRight, Briefcase, CheckCircle2, Clock3, Heart, MapPin, Shield, ShieldCheck, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
const stats = [{
  value: 100,
  suffix: "+",
  label: "Projets livrés",
  decimals: 0
}, {
  value: 500,
  suffix: "+",
  label: "Étudiants formés",
  decimals: 0
}, {
  value: 6,
  suffix: "",
  label: "Domaines d'expertise",
  decimals: 0
}, {
  value: 3,
  suffix: "",
  label: "Experts fondateurs",
  decimals: 0
}];
const timelineData = [{
  year: "2019",
  title: "Naissance du laboratoire",
  description: "LaboGraphie voit le jour a Yaounde avec une idee simple : creer un laboratoire d'innovation capable d'accompagner les entreprises camerounaises dans leur transformation digitale.",
  image: heroGrid1,
  position: "left"
}, {
  year: "2021",
  title: "Notre parcours",
  description: "Nous elargissons notre offre : design, developpement web et mobile, marketing digital. Notre equipe grandit et notre reputation de rigueur et de creativite s'installe.",
  image: heroGrid2,
  position: "right"
}, {
  year: "2023",
  title: "Notre histoire",
  description: "LaboGraphie devient un cabinet informatique reconnu, ajoutant la cybersecurite et les formations professionnelles a son catalogue, avec plus de 500 etudiants formes.",
  image: heroGrid3,
  position: "left"
}, {
  year: "2024",
  title: "LaboGraphie aujourd'hui",
  description: "Installes a Bastos, Yaounde, nous avons livre plus de 100 projets et accompagnons durablement nos clients grace a notre maintenance IT et reseau.",
  image: heroGrid4,
  position: "right"
}];
const coreValues = [{
  title: "Equipe d'experts",
  description: "Notre equipe reunit des experts passionnes en design, developpement, marketing et cybersecurite au service de chaque projet.",
  icon: Users
}, {
  title: "Processus agile",
  description: "Nous privilegions un processus rapide et structure pour livrer vos projets dans les meilleurs delais.",
  icon: Zap
}, {
  title: "Disponibilite",
  description: "Notre support et notre maintenance IT sont disponibles pour repondre rapidement aux besoins de nos clients.",
  icon: Clock3
}, {
  title: "Engagement fort",
  description: "Nous sommes profondement engages envers la satisfaction de nos clients, avec une attention particuliere portee aux details.",
  icon: Heart
}, {
  title: "Responsabilite",
  description: "Nous respectons les normes ethiques les plus strictes et priorisons la securite des donnees dans toutes nos missions.",
  icon: Shield
}, {
  title: "Securite avant tout",
  description: "La protection des donnees de nos clients est une priorite, grace a une veille constante et des outils adaptes.",
  icon: ShieldCheck
}];
const missionFeatures = ["Dépasser les attentes de nos clients grâce à un service exceptionnel et personnalisé.", "Cultiver l’honnêteté et la transparence dans toutes nos relations professionnelles.", "Adopter en continu de nouvelles technologies pour améliorer nos services."];
const visionFeatures = ["Adopter les technologies les plus innovantes pour enrichir nos offres de services.", "Construire des relations durables avec nos clients basées sur l’intégrité et la transparence.", "Avoir un impact positif dans les communautés que nous servons au Cameroun."];
const teamMembers = [{
  name: "Nde Jordan L.",
  role: "Chief Executive Officer",
  image: profile1
}, {
  name: "Funga Brinda",
  role: "Chief Technology Officer",
  image: profile2
}, {
  name: "Yvanna",
  role: "Chief Marketing Officer & Product Manager",
  image: profile3
}];
const FlipButton = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <button className="group relative px-8 py-4 bg-white border-primary rounded-full overflow-hidden border">
    <span className="relative block overflow-hidden h-6">
      <span className="block transition-transform duration-300 group-hover:-translate-y-full text-primary font-semibold">
        {children}
      </span>
      <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full text-primary font-semibold">
        {children}
      </span>
    </span>
  </button>;
};

const About = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [animatedYears, setAnimatedYears] = useState<Set<number>>(new Set());
  const { data: careers, isLoading: careersLoading } = useCareers();

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const timelineHeight = timelineRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate how much of the timeline has been scrolled past
      const startOffset = windowHeight * 0.9; // Start filling when timeline is 10% from top
      const scrolled = startOffset - rect.top;
      const totalScrollable = timelineHeight + startOffset - windowHeight * 0.3;

      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      setScrollProgress(progress);

      // Track which years have become active
      timelineData.forEach((_, index) => {
        const itemProgress = (index + 1) / timelineData.length;
        const isActive = progress >= itemProgress - 0.15;
        if (isActive && !animatedYears.has(index)) {
          setAnimatedYears(prev => new Set(prev).add(index));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animatedYears]);
  return <div className="min-h-screen">
    <Header />
    <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pb-32 bg-primary-foreground text-primary">
        <div className="container-custom section-padding text-primary-foreground">
          <FadeIn>
            <div className="flex lg:flex-row w-full flex-col gap-12 items-end justify-between mb-12">
              <div>
                <h1 className="leading-tight text-black font-bold text-6xl">
                  Laboratoire d'innovation<br />et cabinet informatique
                </h1>
              </div>
              <div className="flex max-w-[468px] items-center">
                <p className="text-black text-justify">
                  Découvrez un partenaire digital fiable à Bastos, Yaoundé. Notre engagement pour la qualité garantit à vos projets numériques expertise, rigueur et innovation.
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn>
            {/* Hero Image with Stats */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden">
                <img src={plumberTeam} alt="Équipe LaboGraphie" className="w-full h-[400px] lg:h-[500px] object-cover" />
              </div>

              {/* Stats Overlay */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white rounded-2xl shadow-xl px-8 py-6">
                <div className="flex divide-x divide-gray-200">
                  {stats.map((stat, index) => <div key={index} className="px-6 first:pl-0 last:pr-0 text-center">
                    <div className="flex items-baseline justify-center gap-0.5 text-4xl md:text-5xl font-bold mb-1 text-primary">
                      <CounterAnimation
                        target={stat.value}
                        decimals={stat.decimals}
                        suffix={stat.suffix}
                        duration={2000}
                        suffixClassName="text-tertiary "
                      />
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                  </div>)}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 lg:py-40 bg-primary">
        <div className="container-custom section-padding">
          <div className="text-center mb-16">
            <p className="text-tertiary font-bold mb-4">Notre histoire</p>
            <h2 className="text-white">En savoir plus sur nous</h2>
          </div>

          {/* Timeline */}
          <div className="relative" ref={timelineRef}>
            {/* Center Line - Background */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 -translate-x-1/2 hidden lg:block" />

            {/* Center Line - Animated Fill */}
            <div
              className="absolute left-1/2 top-0 w-0.5 bg-tertiary -translate-x-1/2 hidden lg:block transition-all duration-100 ease-out"
              style={{ height: `${scrollProgress * 100}%` }}
            />

            <div className="space-y-16">
              {timelineData.map((item, index) => {
                const itemProgress = (index + 1) / timelineData.length;
                const isActive = scrollProgress >= itemProgress - 0.15;
                const hasBeenAnimated = animatedYears.has(index);
                const shouldAnimate = hasBeenAnimated && isActive;

                return (
                  <FadeIn key={index} delay={index * 150}>
                    <div className={`flex flex-col lg:flex-row items-center gap-8 ${item.position === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                      {/* Image Side */}
                      <div className={`w-full lg:w-5/12 transition-all duration-700 ${shouldAnimate
                        ? 'opacity-100 translate-y-0'
                        : hasBeenAnimated
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-8'
                        }`}>
                        <div className="rounded-2xl overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
                        </div>
                        {item.position === 'left' && <div className="mt-6 lg:block hidden">
                          <h4 className="text-white font-bold mb-2">{item.title === "Notre parcours" || item.title === "LaboGraphie aujourd'hui" ? item.title : ""}</h4>
                          {(item.title === "Notre parcours" || item.title === "LaboGraphie aujourd'hui") && <p className="text-white/60 text-sm">{item.description}</p>}
                        </div>}
                      </div>

                      {/* Year Badge */}
                      <div className="lg:w-2/12 flex justify-center relative">
                        <div
                          className={`font-bold px-4 py-2 rounded-full text-sm z-10 transition-all duration-500 ${isActive
                            ? 'bg-tertiary text-primary scale-110'
                            : 'bg-white/20 text-white/60'
                            }`}
                        >
                          {item.year}
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className={`w-full lg:w-5/12 transition-all duration-700 ${shouldAnimate
                        ? 'opacity-100 translate-y-0'
                        : hasBeenAnimated
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-8'
                        }`}>
                        <h4 className={`font-bold mb-3 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/60'}`}>{item.title}</h4>
                        <p className={`text-sm leading-relaxed transition-colors duration-500 ${isActive ? 'text-white/80' : 'text-white/40'}`}>{item.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 lg:py-32 bg-[#F0F3F8]">
        <div className="container-custom section-padding">
          {/* Header Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div>
              <p className="text-secondary font-bold mb-4">Valeurs</p>
              <h2 className="text-primary">Nos valeurs fondamentales</h2>
            </div>
            <div className="flex items-center">
              <p className="text-muted-foreground">
                Nous croyons au pouvoir du travail d'équipe. Notre équipe pluridisciplinaire collabore pour relever les défis digitaux les plus complexes, dans une culture de collaboration et de respect.
              </p>
            </div>
          </div>

          {/* 6 Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => <FadeIn key={index} delay={index * 100}>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 h-full">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-tertiary" />
                </div>
                <h5 className="text-primary font-bold mb-3">{value.title}</h5>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            </FadeIn>)}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container-custom section-padding">
          <div className="text-center mb-20">
            <p className="text-secondary font-bold mb-4">Mission & Vision</p>
            <h2 className="text-black font-bold">Transformer vos ambitions<br />digitales en réalité</h2>
          </div>

          <div className="space-y-24">
            {/* Mission */}
            <FadeIn>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="rounded-2xl overflow-hidden">
                  <img src={mission} alt="Our Mission" className="w-full h-80 lg:h-96 object-cover" />
                </div>
                <div>
                  <h3 className="text-black font-bold mb-4">Notre mission</h3>
                  <p className="text-muted-foreground mb-8 font-semibold text-justify leading-relaxed">
                    Chez LaboGraphie, notre mission est de fournir des services digitaux de haute qualité qui garantissent sécurité, performance et efficacité. Nous nous engageons à offrir un service client exceptionnel et un savoir-faire d'expert.
                  </p>
                  <ul className="space-y-4">
                    {missionFeatures.map((feature, index) => <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                      <span className="text-muted-foreground text-lg">{feature}</span>
                    </li>)}
                  </ul>
                </div>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                <div>
                  <h3 className="text-black font-bold mb-4">Notre vision</h3>
                  <p className="text-muted-foreground mb-8 font-semibold text-justify leading-relaxed">
                    Notre vision est de devenir le laboratoire d'innovation et cabinet informatique de référence au Cameroun, porté par l'intégrité, l'innovation et l'excellence, en fixant la norme de qualité du secteur digital.
                  </p>
                  <ul className="space-y-4">
                    {visionFeatures.map((feature, index) => <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                      <span className="text-muted-foreground text-lg">{feature}</span>
                    </li>)}
                  </ul>
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img src={vision} alt="Our Vision" className="w-full h-80 lg:h-96 object-cover" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32 bg-[#F5F7FA]">
        <div className="container-custom section-padding">
          <div className="text-center mb-16">
            <p className="text-secondary font-bold mb-4">Notre équipe</p>
            <h2 className="text-primary">Rencontrez notre équipe d'experts</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {teamMembers.map((member, index) => <FadeIn key={index} delay={index * 80}>
              <div className="bg-white rounded-2xl p-6 transition-all duration-300 group">
                <div className="rounded-xl overflow-hidden mb-4 group-hover:bg-accent bg-[#E8ECF4]">
                  <img src={member.image} alt={member.name} className="h-[460px] object-cover group-hover:scale-105 transition-all duration-300" />
                </div>
                <h5 className="text-secondary font-bold transition-colors">{member.name}</h5>
                <p className="text-muted-foreground text-base transition-colors">{member.role}</p>
              </div>
            </FadeIn>)}
          </div>
          <Link to={"/career"} className="flex items-center justify-center">
            <FlipButton>Rejoindre l'équipe</FlipButton>
          </Link>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="pt-20 lg:pt-32 bg-white">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-secondary font-bold mb-4">Carrières</p>
              <h2 className="text-primary text-4xl lg:text-5xl">
                Opportunités de<br />rejoindre notre équipe
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-muted-foreground">
                Nous offrons un environnement de travail dynamique et stimulant qui favorise l'évolution professionnelle. En rejoignant notre équipe, vous travaillerez sur des projets variés et innovants.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {careersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement des postes...</p>
              </div>
            ) : careers && careers.length > 0 ? (
              careers.map((otherJob, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <Link
                    to={`/career/${otherJob.slug}`}
                    className={`bg-[#E8ECF4] cursor-pointer rounded-xl px-6 py-5 flex items-center justify-between hover:bg-accent transition-all group duration-300`}
                  >
                    <div className="flex items-center gap-8 flex-wrap">
                      <h5 className="text-primary font-bold min-w-[200px]">
                        {otherJob.title}
                      </h5>
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="w-4 h-4" />
                          {otherJob.type}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {otherJob.location}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-6 h-6 text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </FadeIn>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun poste disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <CTA />
    </main>
    <Footer />
  </div>;
};
export default About;