import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { services } from "@/data/services";
import { useServicePricing } from "@/hooks/usePricing";
import { Link } from "react-router-dom";

const Services = () => {
  const { data: servicePricingData = [] } = useServicePricing();

  return <div className="min-h-screen">
    <Header />

    {/* Hero Section with Service Cards */}
    <section className="pt-20 bg-white">
      <div className="container-custom section-padding">
        {/* Breadcrumb */}
        <div className="text-muted-foreground text-sm mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Services</span>
        </div>

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <h1 className="text-black text-7xl font-bold">Nos Services</h1>
          <p className="text-muted-foreground text-lg lg:pt-4">
            Laboratoire d'innovation et cabinet informatique, LaboGraphie accompagne entreprises et institutions camerounaises avec des solutions digitales sur mesure, du design à la cybersécurité.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const dynamicPricing = servicePricingData.find(p => p.slug === service.slug);
            const localTJM = dynamicPricing?.local_tjm ?? service.localTJM;
            
            return (
              <FadeIn key={index} delay={index * 100}>
                <Link to={`/services/${service.slug}`}>
                  <div className="group cursor-pointer transition-all bg-[#f3f3f6] rounded-xl hover:bg-primary h-full px-[30px] py-[28px] duration-300">
                    {/* Image */}
                    <div className="overflow-hidden mb-6 rounded-md min-h-[340px] max-h-[340px]">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-md" />
                    </div>

                    {/* Content */}
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-4xl duration-300 transition-all text-black group-hover:text-accent">
                        {service.title}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-primary group-hover:text-white transition-colors duration-300">
                        À partir de {localTJM.toLocaleString("fr-FR")} FCFA / jour
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed transition-all duration-300 group-hover:text-white">
                      {service.description}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>

    <CTA />
    <Footer />
  </div>;
};
export default Services;
