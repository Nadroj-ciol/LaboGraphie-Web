import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";
import FadeIn from "@/components/FadeIn";

const testimonials = [{
  name: "TEFOUET Ange Darlaine",
  location: "Yaoundé, Cameroun",
  text: "LaboGraphie a su transformer notre image de marque en un temps record. Leur équipe allie créativité et rigueur, un vrai plaisir de travailler avec eux.",
  avatar: avatar1
}, {
  name: "Nelly Ariane Gounou",
  location: "Douala, Cameroun",
  text: "Notre site e-commerce a été livré dans les délais, avec un design moderne et performant. Une équipe à l'écoute et très professionnelle.",
  avatar: avatar2
}, {
  name: "Cecile Emmanuelle Njoh",
  location: "Yaoundé, Cameroun",
  text: "La formation dispensée par LaboGraphie a permis à toute notre équipe de monter en compétences sur le digital. Un accompagnement de qualité.",
  avatar: avatar3
}, {
  name: "Michel Pavel Tsobgny Zambou",
  location: "Bafoussam, Cameroun",
  text: "Grâce à leur stratégie marketing digital, notre visibilité en ligne a explosé. Des résultats concrets et mesurables dès les premiers mois.",
  avatar: avatar4
}, {
  name: "Alan Miguel Feuwo T.",
  location: "Douala, Cameroun",
  text: "Un audit de cybersécurité complet et rassurant. LaboGraphie a su identifier nos failles et proposer des solutions adaptées à notre budget.",
  avatar: avatar5
}];

const TestimonialCard = ({
  name,
  location,
  text,
  avatar
}: typeof testimonials[0]) => <div className="bg-white rounded-2xl p-6 min-w-[320px] max-w-[320px] flex-shrink-0">
    <div className="flex items-center gap-3 mb-4">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <h6 className="font-semibold text-base text-secondary">{name}</h6>
        <p className="text-muted-foreground text-sm">{location}</p>
      </div>
    </div>
    <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
  </div>;

const Testimonials = () => {
  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  return <section className="py-20 lg:py-32 bg-primary overflow-hidden">
    <div className="container-custom section-padding">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
        <div>
          <FadeIn>
            <p className="text-tertiary font-medium mb-4">TÉMOIGNAGES</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-white">
              Ce que disent
              <br />
              nos clients
            </h2>
          </FadeIn>
        </div>
        <FadeIn delay={200}>
          <p className="text-white max-w-xl mt-6 lg:mt-0">
            Découvrez les retours de nos clients sur les projets digitaux que nous avons menés ensemble. Chaque témoignage reflète notre engagement pour l'excellence et la satisfaction client.
          </p>
        </FadeIn>
      </div>
    </div>

    {/* Marquee Row 1 - Slides Left */}
    <FadeIn delay={300}>
      <div className="relative mb-4">
        <div className="flex gap-4 animate-marquee-left">
          {duplicatedTestimonials.map((testimonial, index) => <TestimonialCard key={`row1-${index}`} {...testimonial} />)}
        </div>
      </div>
    </FadeIn>

    {/* Marquee Row 2 - Slides Right */}
    <FadeIn delay={400}>
      <div className="relative">
        <div className="flex gap-4 animate-marquee-right">
          {duplicatedTestimonials.map((testimonial, index) => <TestimonialCard key={`row2-${index}`} {...testimonial} />)}
        </div>
      </div>
    </FadeIn>
  </section>;
};
export default Testimonials;
