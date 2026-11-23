import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import heroGrid1 from "@/assets/service-design-branding.webp";
import heroGrid2 from "@/assets/service-web-mobile.webp";
import heroGrid3 from "@/assets/studio-team-hero.webp";
import heroGrid4 from "@/assets/work-cybersecurity-audit.webp";
import heroGrid5 from "@/assets/work-marketing-web.webp";
import heroGrid6 from "@/assets/cta-studio-banner.webp";
import { Button } from "@/components/ui/button";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useTranslation } from "react-i18next";
const FlipButton = ({
  children,
  variant = "light"
}: {
  children: React.ReactNode;
  variant?: "light" | "dark";
}) => {
  const bgClass = variant === "light"
    ? "bg-tertiary text-tertiary-foreground hover:bg-tertiary/90"
    : "bg-surface-dark text-accent border border-accent hover:bg-accent hover:text-accent-foreground";
  return (
    <Button size="default" className={`group relative overflow-hidden font-semibold rounded-full px-6 ${bgClass}`}>
      <span className="flex items-center gap-2 font-bold transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
        {children}
      </span>
      <span className="absolute inset-0 flex font-bold items-center justify-center gap-2 transition-all duration-300 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
        {children}
      </span>
    </Button>
  );
};
const Hero = () => {
  const { t } = useTranslation();

  const leftColumnImages = [{
    src: heroGrid1,
    alt: "Séance de travail sur une identité visuelle",
    className: "rounded-2xl"
  }, {
    src: heroGrid3,
    alt: "Développeur travaillant sur un site web",
    className: "rounded-full"
  }, {
    src: heroGrid5,
    alt: "Atelier de formation digitale",
    className: "rounded-2xl"
  }];
  const rightColumnImages = [{
    src: heroGrid2,
    alt: "Designer créant une charte graphique",
    className: "rounded-full"
  }, {
    src: heroGrid4,
    alt: "Analyse de cybersécurité sur écran",
    className: "rounded-2xl"
  }, {
    src: heroGrid6,
    alt: "Équipe LaboGraphie en réunion",
    className: "rounded-full"
  }];
  return <section className="relative bg-surface-dark overflow-hidden">
    {/* Content */}
    <div className="container-custom section-padding relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 relative items-center min-h-[calc(100vh-8rem)]">
        {/* Left Content */}
        <div className="max-w-2xl relative z-10">
          <div className="animate-fade-up">
            <h1 className="text-white font-bold mb-6 text-5xl md:text-6xl lg:text-7xl leading-[1.1] max-w-[800px] text-left xl:text-7xl">
              {t("home.hero.titleLine1")}
              <br />
              {t("home.hero.titleLine2")}
              <br />
              <span className="text-tertiary">{t("home.hero.titleHighlight")}</span>
            </h1>
          </div>

          <p style={{
            animationDelay: "0.1s"
          }} className="text-white text-lg mb-8 max-w-[800px] animate-fade-up md:text-base">
            {t("home.hero.description")}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12 animate-fade-up" style={{
            animationDelay: "0.2s"
          }}>
            <Link to="/quote">
              <FlipButton>{t("home.hero.requestQuote")}</FlipButton>
            </Link>
            <Link to="/services">
              <FlipButton variant="dark">
                {t("home.hero.discoverServices")}
              </FlipButton>
            </Link>
          </div>

          {/* Client Stats */}
          <div className="flex items-center gap-4 animate-fade-up" style={{
            animationDelay: "0.3s"
          }}>
            <div className="flex items-center">
              <div className="flex -space-x-3">
                <img src={avatar1} alt="Client LaboGraphie" className="w-12 h-12 rounded-full border-2 border-secondary object-cover" />
                <img src={avatar2} alt="Cliente LaboGraphie" className="w-12 h-12 rounded-full border-2 border-secondary object-cover" />
                <img src={avatar3} alt="Partenaire LaboGraphie" className="w-12 h-12 rounded-full border-2 border-secondary object-cover" />
                <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center text-tertiary-foreground text-sm font-bold border-2 border-surface-dark">
                  100+
                </div>
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-xl">{t("home.hero.projectsCount")}</p>
              <p className="text-white/60 text-sm">{t("home.hero.projectsDelivered")}</p>
            </div>
          </div>
        </div>


        {/* Right Side - Image Grid with Marquee */}
        <div style={{
          width: '432px'
        }} className="hidden lg:flex gap-7 justify-end absolute right-0 top-0 bottom-0 overflow-hidden z-0">
          {/* Left Column - slides down continuously */}
          <div className="flex flex-col gap-4 animate-marquee-down">
            {[...leftColumnImages, ...leftColumnImages].map((image, index) => <div key={index} className="overflow-hidden flex-shrink-0">
              <img src={image.src} alt={image.alt} className={`w-50 h-50 object-cover ${image.className}`} />
            </div>)}
          </div>

          {/* Right Column - slides up continuously */}
          <div className="flex flex-col gap-4 animate-marquee-up mt-8">
            {[...rightColumnImages, ...rightColumnImages].map((image, index) => <div key={index} className="overflow-hidden flex-shrink-0">
              <img src={image.src} alt={image.alt} className={`w-50 h-50 object-cover ${image.className}`} />
            </div>)}
          </div>
        </div>
      </div>
    </div>
  </section>;
};
export default Hero;
