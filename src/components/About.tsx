import plumberTeam from "@/assets/hero-4.png";
import plumberTeam1 from "@/assets/hero-41.png";
import FadeIn from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
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
  title: "Équipe experte",
  description: "Une équipe pluridisciplinaire de designers, développeurs et consultants forts de plus de 8 ans d'expertise combinée."
}, {
  title: "Solutions complètes",
  description: "Du branding au développement, en passant par la cybersécurité et la formation, nous couvrons tous vos besoins digitaux."
}];
const About = () => {
  return <section id="about" className="py-20 lg:py-32 bg-card">
    <div className="container-custom section-padding">
      <div className="grid lg:grid-cols-2 gap-28 items-center">
        {/* Left - Image */}
        <FadeIn>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden">
              <img src={plumberTeam} alt="Équipe LaboGraphie" className="w-full h-auto object-cover" />
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-12 w-[240px] h-[240px] -right-12 overflow-hidden rounded-xl text-white">
              <img src={plumberTeam1} alt="Équipe LaboGraphie" className="h-full object-cover " />
            </div>
          </div>
        </FadeIn>

        {/* Right - Content */}
        <div>
          <FadeIn delay={100}>
            <p className="text-secondary mb-4 font-bold"> Qui sommes-nous</p>
          </FadeIn>
          <FadeIn delay={200}>
            <h2 className="text-primary mb-6 text-5xl">
              Le laboratoire digital qui donne vie à vos idées
            </h2>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-muted-foreground mb-8 font-semibold">
              LaboGraphie est née de la volonté de fusionner la créativité d'un laboratoire technique avec la rigueur d'un cabinet de conseil. Basée à Bastos, Yaoundé, notre agence accompagne entreprises et institutions dans leur transformation digitale.
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
      </div>
    </div>
  </section>;
};
export default About;
