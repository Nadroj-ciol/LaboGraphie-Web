import heroPlumber from "@/assets/hero-5.png";
import teamPlumber from "@/assets/hero-51.png";
import FadeIn from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone } from "lucide-react";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { site } from "@/data/site";

const FlipButton = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <Button variant="default" size="default" className="group relative overflow-hidden border border-primary text-white hover:text-primary">
    <span className="flex items-center gap-2 transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
      <Phone className="h-4 w-4" />
      {children}
    </span>
    <span className="absolute text-white inset-0 flex items-center justify-center gap-2 transition-all duration-300 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 bg-primary">
      <Phone className="h-4 w-4" />
      {children}
    </span>
  </Button>;
};

const features = [{
  title: "Expertise de haut niveau",
  description: "Une équipe qualifiée qui contribue de manière concrète à la réussite et à l'efficacité de chaque projet."
}, {
  title: "Accompagnement continu",
  description: "Un support réactif et un suivi rigoureux pour répondre à vos besoins quotidiens comme à vos urgences."
}, {
  title: "Outils innovants",
  description: "Des technologies modernes qui transforment la manière de communiquer, travailler et vendre en ligne."
}];
const About = () => {
  return <section id="about" className="py-20 pb-40 relative bg-card">
    <div className="container-custom section-padding">
      <div className="grid lg:grid-cols-2 gap-28 items-start">
        {/* Right - Content */}
        <div>
          <FadeIn delay={100}>
            <p className="text-secondary mb-4 font-bold"> Pourquoi nous choisir</p>
          </FadeIn>
          <FadeIn delay={200}>
            <h2 className="text-primary mb-6 text-5xl">
              Des solutions digitales pour tous vos besoins
            </h2>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-muted-foreground mb-8 font-semibold">
              Nous bâtissons la confiance de nos clients grâce à un service constamment exceptionnel et une expertise éprouvée face aux défis digitaux les plus exigeants.
            </p>
          </FadeIn>

          {/* Features */}
          <div className="space-y-6 mb-8 text-white">
            {features.map((feature, index) => <FadeIn key={index} delay={400 + index * 100}>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-secondary stroke-white border rounded-full bg-primary" />
                </div>
                <div>
                  <h6 className="text-primary text-2xl mb-1 font-bold">{feature.title}</h6>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </FadeIn>)}
          </div>


          <Link to={site.phoneHref}>
            <FadeIn delay={600}>
              <FlipButton>Appelez {site.phone}</FlipButton>
            </FadeIn>
          </Link>
        </div>
        {/* Left - Image */}
        <FadeIn className="h-[90%]">
          <div className="relative h-full">
            <div className="rounded-3xl h-full overflow-hidden">
              <img src={heroPlumber} alt="Équipe LaboGraphie" className="h-auto w-full object-cover" />
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-12 w-[240px] h-[240px] -left-12 overflow-hidden rounded-xl text-white">
              <img src={teamPlumber} alt="Équipe LaboGraphie" className="h-full object-cover " />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[84%] h-[1px] bg-black/10 z-10" />
  </section >;
};
export default About;
