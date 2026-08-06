import heroGrid2 from "@/assets/hero-grid-2.jpg";
import blogFallbackImage from "@/assets/hero-plumber.jpg";
import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useBlog, usePublishedBlogs } from "@/hooks/useBlogs";
import DOMPurify from "dompurify";
import { Facebook, Twitter, Linkedin, Link2, MessageCircle, Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { toast } from "sonner";

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = useBlog(slug || "");
  const { data: allBlogs } = usePublishedBlogs();

  const relatedPosts = allBlogs?.filter((p) => p.slug !== slug).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="py-32 md:py-40 text-center">
          <h1 className="text-primary">Article introuvable</h1>
          <Link to="/blog" className="text-secondary hover:underline mt-4 inline-block">
            Retour au blog
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('fr-FR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié dans le presse-papiers !");
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <FadeIn>
        <section className="pt-32 pb-8 bg-white">
          <div className="container-custom section-padding">
            {/* Meta */}
            <p className="text-muted-foreground text-sm text-center mb-4">
              {formattedDate} · {post.read_time}
            </p>

            {/* Title */}
            <h1 className="text-primary text-center max-w-3xl mx-auto mb-10">
              {post.title}
            </h1>

            {/* Main Image */}
            <div className="rounded-3xl overflow-hidden mb-8">
              <img
                src={post.image_url || blogFallbackImage}
                alt={post.title}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Content Section */}
      <FadeIn>
        <section className="py-8 bg-white">
          <div className="container-custom section-padding">
            <div className="max-w-5xl mx-auto">
              {/* Intro Paragraph */}
              {post.excerpt && (
                <p className="text-muted-foreground mb-10 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              {post.content ? (
                <div
                  className="prose prose-lg max-w-none text-muted-foreground mb-10"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content, {
                      USE_PROFILES: { html: true },
                    }),
                  }}
                />
              ) : (
                <>
                  {/* Default content sections */}
                  <h4 className="text-primary mb-4">Éviter des dépenses inutiles</h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Une identité visuelle mal pensée ou un site web obsolète peuvent coûter cher à long terme. En investissant tôt dans une stratégie digitale solide, vous évitez des refontes coûteuses et renforcez la confiance de vos clients.
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                    <li>Un audit régulier permet d'anticiper les failles de sécurité.</li>
                    <li>Une détection précoce des problèmes techniques évite des coûts élevés.</li>
                    <li>Un accompagnement professionnel garantit un fonctionnement optimal.</li>
                  </ul>

                  <h4 className="text-primary mb-4">Améliorer la performance</h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Les outils digitaux modernes sont bien plus performants que les anciennes solutions. Moderniser vos plateformes permet de réduire les coûts opérationnels tout en améliorant l'expérience de vos utilisateurs.
                  </p>

                  <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-primary mb-4">Renforcer votre image de marque</h4>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        Une présence digitale bien maîtrisée valorise votre entreprise et attire de nouveaux clients.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Un branding cohérent et un site performant sont des atouts différenciants sur le marché.
                      </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden">
                      <img
                        src={heroGrid2}
                        alt="Équipe LaboGraphie au travail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Share Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between py-6 px-6 sm:px-8 rounded-2xl bg-[#F4F4F7] border border-gray-200 shadow-sm gap-4">
                <span className="text-secondary text-base font-bold">Cet article vous a plu ? Partagez-le !</span>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " : " + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-[#25D366] hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                    title="Partager sur WhatsApp"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-[#0088cc] hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                    title="Partager sur Telegram"
                  >
                    <Send className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-[#1DA1F2] hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                    title="Partager sur X (Twitter)"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-[#1877F2] hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                    title="Partager sur Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                    title="Partager sur LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer"
                    title="Copier le lien"
                  >
                    <Link2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Related Blogs Section */}
      {relatedPosts.length > 0 && (
        <FadeIn>
          <section className="pt-16 bg-white">
            <div className="container-custom section-padding">
              <h2 className="text-primary text-center mb-12">Articles similaires</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <FadeIn key={relatedPost.id} delay={index * 100}>
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <article className="group cursor-pointer bg-inherit">
                        <div className="relative rounded-2xl overflow-hidden mb-4">
                          <img
                            src={relatedPost.image_url || blogFallbackImage}
                            alt={relatedPost.title}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-4 left-4 bg-tertiary text-primary text-xs font-medium px-3 py-1 rounded-full">
                            {relatedPost.category}
                          </span>
                        </div>
                        <h5 className="text-primary mb-2 group-hover:text-secondary transition-colors">
                          {relatedPost.title}
                        </h5>
                        <p className="text-muted-foreground text-sm">
                          {new Date(relatedPost.created_at).toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })} · {relatedPost.read_time}
                        </p>
                      </article>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      <FadeIn>
        <CTA />
      </FadeIn>
      <Footer />
    </div>
  );
};

export default BlogDetail;
