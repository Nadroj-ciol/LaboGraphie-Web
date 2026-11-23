import plumberTeam from "@/assets/about-hero-1.png";
import mission from "@/assets/mission-1.png";
import vision from "@/assets/mission-2.png";
import profile1 from "@/assets/profile-1.png";
import jordanPortrait from "@/assets/jordan-portrait-pro.webp";
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
import { ArrowUpRight, Briefcase, CheckCircle2, Clock3, ExternalLink, Github, Heart, Linkedin, MapPin, Shield, ShieldCheck, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useTranslation } from "react-i18next";

// Données non traduisibles (images, positions, icônes), associées par index
// aux textes traduits dans about.timeline / about.coreValues.
const timelineMeta = [
  { year: "2019", image: heroGrid1, position: "left" },
  { year: "2021", image: heroGrid2, position: "right" },
  { year: "2023", image: heroGrid3, position: "left" },
  { year: "2024", image: heroGrid4, position: "right" },
];

const coreValuesIcons = [Users, Zap, Clock3, Heart, Shield, ShieldCheck];

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

const getTeamMembers = (t: (key: string) => string): TeamMember[] => [{
  name: "FUNGA BIADJEU Brinda",
  role: t("about.teamBrindaRole"),
  bio: t("about.teamBrindaBio"),
  image: profile1
}, {
  name: "NDE Jordan Loïc",
  role: t("about.teamJordanRole"),
  bio: t("about.teamJordanBio"),
  image: jordanPortrait,
  portfolioUrl: "https://nadroj-ciol.github.io/Portfolio-website-perso/",
  githubUrl: "https://github.com/Nadroj-ciol",
  linkedinUrl: "https://www.linkedin.com/in/jordan-lo%C3%AFc-nde-63b041427/",
}, {
  name: "NONO NOUTCHANG Yvanna",
  role: t("about.teamYvannaRole"),
  bio: t("about.teamYvannaBio"),
  image: profile3
}];

const FlipButton = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <button className="group relative px-8 py-4 bg-background border-primary rounded-full overflow-hidden border">
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
  const { t } = useTranslation();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [animatedYears, setAnimatedYears] = useState<Set<number>>(new Set());
  const { data: careers, isLoading: careersLoading } = useCareers();

  const stats = [
    { value: 100, suffix: "+", label: t("about.stats.projects"), decimals: 0 },
    { value: 500, suffix: "+", label: t("about.stats.students"), decimals: 0 },
    { value: 6, suffix: "", label: t("about.stats.expertise"), decimals: 0 },
    { value: 3, suffix: "", label: t("about.stats.founders"), decimals: 0 },
  ];

  const translatedTimeline = t("about.timeline", { returnObjects: true }) as { title: string; description: string }[];
  const timelineData = translatedTimeline.map((item, i) => ({ ...item, ...timelineMeta[i] }));

  const translatedCoreValues = t("about.coreValues", { returnObjects: true }) as { title: string; description: string }[];
  const coreValues = translatedCoreValues.map((value, i) => ({ ...value, icon: coreValuesIcons[i] }));

  const missionFeatures = t("about.missionFeatures", { returnObjects: true }) as string[];
  const visionFeatures = t("about.visionFeatures", { returnObjects: true }) as string[];

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
  }, [animatedYears, timelineData]);
  return <div className="min-h-screen">
    <Header />
    <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pb-32 bg-primary-foreground text-primary">
        <div className="container-custom section-padding text-primary-foreground">
          <FadeIn>
            <div className="flex lg:flex-row w-full flex-col gap-12 items-end justify-between mb-12">
              <div>
                <h1 className="leading-tight text-foreground font-bold text-6xl">
                  {t("about.hero.titleLine1")}<br />{t("about.hero.titleLine2")}
                </h1>
              </div>
              <div className="flex max-w-[468px] items-center">
                <p className="text-foreground text-justify">
                  {t("about.hero.description")}
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
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-background rounded-2xl shadow-xl px-8 py-6">
                <div className="flex divide-x divide-border">
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
      <section className="py-32 lg:py-40 bg-surface-dark">
        <div className="container-custom section-padding">
          <div className="text-center mb-16">
            <p className="text-tertiary font-bold mb-4">{t("about.timelineLabel")}</p>
            <h2 className="text-white">{t("about.timelineTitle")}</h2>
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
      <section className="py-20 lg:py-32 bg-muted">
        <div className="container-custom section-padding">
          {/* Header Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div>
              <p className="text-secondary font-bold mb-4">{t("about.valuesLabel")}</p>
              <h2 className="text-primary">{t("about.valuesTitle")}</h2>
            </div>
            <div className="flex items-center">
              <p className="text-muted-foreground">
                {t("about.valuesDescription")}
              </p>
            </div>
          </div>

          {/* 6 Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => <FadeIn key={index} delay={index * 100}>
              <div className="bg-background rounded-2xl p-8 border border-border h-full">
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
      <section className="py-20 lg:py-32 bg-background">
        <div className="container-custom section-padding">
          <div className="text-center mb-20">
            <p className="text-secondary font-bold mb-4">{t("about.missionVisionLabel")}</p>
            <h2 className="text-foreground font-bold">{t("about.missionVisionTitleLine1")}<br />{t("about.missionVisionTitleLine2")}</h2>
          </div>

          <div className="space-y-24">
            {/* Mission */}
            <FadeIn>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="rounded-2xl overflow-hidden">
                  <img src={mission} alt={t("about.missionTitle")} className="w-full h-80 lg:h-96 object-cover" />
                </div>
                <div>
                  <h3 className="text-foreground font-bold mb-4">{t("about.missionTitle")}</h3>
                  <p className="text-muted-foreground mb-8 font-semibold text-justify leading-relaxed">
                    {t("about.missionDescription")}
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
                  <h3 className="text-foreground font-bold mb-4">{t("about.visionTitle")}</h3>
                  <p className="text-muted-foreground mb-8 font-semibold text-justify leading-relaxed">
                    {t("about.visionDescription")}
                  </p>
                  <ul className="space-y-4">
                    {visionFeatures.map((feature, index) => <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                      <span className="text-muted-foreground text-lg">{feature}</span>
                    </li>)}
                  </ul>
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img src={vision} alt={t("about.visionTitle")} className="w-full h-80 lg:h-96 object-cover" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="container-custom section-padding">
          <div className="text-center mb-16">
            <p className="text-secondary font-bold mb-4">{t("about.teamLabel")}</p>
            <h2 className="text-primary">{t("about.teamTitle")}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {getTeamMembers(t).map((member, index) => <FadeIn key={index} delay={index * 80} className="h-full">
              <div className="bg-background rounded-2xl p-6 transition-all duration-300 group h-full flex flex-col">
                <div className="rounded-xl overflow-hidden mb-4 group-hover:bg-accent bg-muted">
                  <img src={member.image} alt={member.name} className="w-full h-[460px] object-cover object-top group-hover:scale-105 transition-all duration-300" />
                </div>
                <h5 className="text-secondary font-bold transition-colors">{member.name}</h5>
                <p className="text-muted-foreground text-base transition-colors">{member.role}</p>
                {member.bio && (
                  <p className="text-muted-foreground/90 text-sm mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                )}
                {(member.portfolioUrl || member.githubUrl || member.linkedinUrl) && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/60">
                    {member.portfolioUrl && (
                      <a
                        href={member.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t("about.viewPortfolio")}
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`GitHub ${member.name}`}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground/80 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn ${member.name}`}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground/80 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </FadeIn>)}
          </div>
          <Link to={"/career"} className="flex items-center justify-center">
            <FlipButton>{t("about.joinTeam")}</FlipButton>
          </Link>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="pt-20 lg:pt-32 bg-background">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-secondary font-bold mb-4">{t("about.careersLabel")}</p>
              <h2 className="text-primary text-4xl lg:text-5xl">
                {t("about.careersTitleLine1")}<br />{t("about.careersTitleLine2")}
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-muted-foreground">
                {t("about.careersDescription")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {careersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">{t("about.loadingPositions")}</p>
              </div>
            ) : careers && careers.length > 0 ? (
              careers.map((otherJob, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <Link
                    to={`/career/${otherJob.slug}`}
                    className={`bg-muted cursor-pointer rounded-xl px-6 py-5 flex items-center justify-between hover:bg-accent transition-all group duration-300`}
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
                <p className="text-muted-foreground">{t("about.noPositions")}</p>
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
