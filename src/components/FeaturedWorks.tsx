import novatechWork from "@/assets/real-branding-3d.webp";
import candaceWork from "@/assets/real-work-candace.webp";
import petittriWork from "@/assets/service-web-mobile.webp";
import FadeIn from "@/components/FadeIn";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FeaturedWorks = () => {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const projects = [
    {
      title: "Novatech",
      slug: "identite-visuelle-novatech",
      description: t("home.featuredWorks.novatechDescription"),
      image: novatechWork,
    },
    {
      title: "Candace",
      slug: "plateforme-ecommerce-candace",
      description: t("home.featuredWorks.candaceDescription"),
      image: candaceWork,
    },
    {
      title: "PetitTri",
      slug: "application-gestion-petittri",
      description: t("home.featuredWorks.petittriDescription"),
      image: petittriWork,
    },
  ];

  const getCardWidth = (index: number) => {
    // If no card is hovered, first card takes 60%, others take 20%
    if (hoveredIndex === null) {
      return index === 0 ? "60%" : "20%";
    }
    // When hovering, hovered card takes 60%, others take 20%
    return hoveredIndex === index ? "60%" : "20%";
  };

  return (
    <section className="py-20 lg:py-32 bg-surface-dark">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <FadeIn>
              <p className="text-tertiary font-medium mb-4">{t("home.featuredWorks.eyebrow")}</p>
            </FadeIn>
            <FadeIn delay={100}>
              <h2 className="text-white">
                {t("home.featuredWorks.titleLine1")}
                <br />
                {t("home.featuredWorks.titleLine2")}
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={200}>
            <p className="text-white max-w-xl mt-6 lg:mt-0">
              {t("home.featuredWorks.description")}
            </p>
          </FadeIn>
        </div>

        {/* Projects Grid */}
        <FadeIn delay={300}>
          <div className="flex gap-4">
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className="relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-1000 ease-in-out block"
                style={{ width: getCardWidth(index) }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-80 object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/50 to-transparent opacity-80" />

                {/* Arrow Icon - Only on hover */}
                <div className={`absolute top-4 right-4 transition-opacity duration-300 ${hoveredIndex === index || (hoveredIndex === null && index === 0) ? "opacity-100" : "opacity-0"
                  }`}>
                  <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center">
                    <ArrowUpRight className="h-5 w-5 text-tertiary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h5 className={`text-white text-3xl font-bold mb-2  ${hoveredIndex === index || (hoveredIndex === null && index === 0) ? "opacity-100" : "opacity-0"}`}>{project.title}</h5>
                  <p className={`text-white line-clamp-2 transition-opacity duration-300 ${hoveredIndex === index || (hoveredIndex === null && index === 0) ? "opacity-100" : "opacity-0"
                    }`}>
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default FeaturedWorks;
