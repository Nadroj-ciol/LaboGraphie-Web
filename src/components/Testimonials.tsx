import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";
import FadeIn from "@/components/FadeIn";
import { useTranslation } from "react-i18next";

const TestimonialCard = ({
  name,
  location,
  text,
  avatar
}: { name: string; location: string; text: string; avatar: string }) => <div className="bg-card rounded-2xl p-6 min-w-[320px] max-w-[320px] flex-shrink-0">
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
  const { t } = useTranslation();

  const testimonials = [{
    name: "TEFOUET Ange Darlaine",
    location: "Yaoundé, Cameroun",
    text: t("home.testimonials.quote1"),
    avatar: avatar1
  }, {
    name: "Nelly Ariane Gounou",
    location: "Douala, Cameroun",
    text: t("home.testimonials.quote2"),
    avatar: avatar2
  }, {
    name: "Cecile Emmanuelle Njoh",
    location: "Yaoundé, Cameroun",
    text: t("home.testimonials.quote3"),
    avatar: avatar3
  }, {
    name: "Michel Pavel Tsobgny Zambou",
    location: "Bafoussam, Cameroun",
    text: t("home.testimonials.quote4"),
    avatar: avatar4
  }, {
    name: "Alan Miguel Feuwo T.",
    location: "Douala, Cameroun",
    text: t("home.testimonials.quote5"),
    avatar: avatar5
  }];

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  return <section className="py-20 lg:py-32 bg-surface-dark overflow-hidden">
    <div className="container-custom section-padding">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
        <div>
          <FadeIn>
            <p className="text-tertiary font-medium mb-4">{t("home.testimonials.eyebrow")}</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-white">
              {t("home.testimonials.titleLine1")}
              <br />
              {t("home.testimonials.titleLine2")}
            </h2>
          </FadeIn>
        </div>
        <FadeIn delay={200}>
          <p className="text-white max-w-xl mt-6 lg:mt-0">
            {t("home.testimonials.description")}
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
