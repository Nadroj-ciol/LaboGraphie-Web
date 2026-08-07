import blogFallbackImage from "@/assets/hero-plumber.jpg";
import CTA from "@/components/CTA";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { usePublishedBlogs } from "@/hooks/useBlogs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { ShareMenu } from "@/components/ShareMenu";

// Les catégories sont un champ texte libre saisi par l'admin en base
// (contenu non traduit, cf. décision de scope) : seuls les 3 filtres
// spéciaux (Tous/Récents/Populaires), qui ne correspondent à aucune
// valeur stockée, ont un libellé traduit.
const CATEGORY_LABEL_KEYS: Record<string, string> = {
  "Tous": "blog.list.categoryAll",
  "Récents": "blog.list.categoryRecent",
  "Populaires": "blog.list.categoryPopular",
};
const categories = ["Tous", "Récents", "Populaires", "Design & Branding", "Marketing Digital", "Cyber-sécurité", "Maintenance", "Réseau", "Histoire"];

const Blog = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "en" ? "en-US" : "fr-FR";
  const [activeCategory, setActiveCategory] = useState("Tous");
  const { data: blogs, isLoading } = usePublishedBlogs();

  const featuredPost = useMemo(() => {
    return blogs?.find((b) => b.is_featured) || blogs?.[0];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    if (activeCategory === "Tous" || activeCategory === "Récents") {
      return blogs;
    }
    if (activeCategory === "Populaires") {
      return blogs.slice(0, 6);
    }
    return blogs.filter((b) => b.category === activeCategory);
  }, [blogs, activeCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-accent motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >{t("blog.loading")}</span>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-background">
    <Header />

    {/* Hero Section */}
    <FadeIn>
      <section className="pt-32 pb-16 bg-background">
        <div className="container-custom section-padding">
          {/* Breadcrumb */}
          <p className="text-muted-foreground text-sm mb-4">{t("common.nav.home")} / {t("common.nav.blog")}</p>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
            <h1 className="text-foreground font-bold">{t("blog.list.title")}</h1>
            <p className="text-muted-foreground max-w-lg font-medium ">
              {t("blog.list.description")}
            </p>
          </div>

          {/* Featured Blog */}
          {featuredPost && (
            <Link to={`/blog/${featuredPost.slug}`}>
              <div className="bg-muted rounded-3xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="relative pl-12 py-10">
                    <img src={featuredPost.image_url || blogFallbackImage} alt={featuredPost.title} className="w-full h-[420px] object-cover rounded-2xl" />
                    <span className="absolute top-16 left-16 bg-tertiary text-primary text-sm font-medium px-4 py-1 rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                  <div className="pr-12 flex flex-col justify-center">
                    <p className="text-secondary font-bold mb-3">{t("blog.list.featuredLabel")}</p>
                    <h3 className="text-foreground font-bold mb-4">{featuredPost.title}</h3>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(featuredPost.created_at).toLocaleDateString(dateLocale, { month: 'long', day: 'numeric', year: 'numeric' })} · {featuredPost.read_time}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>
    </FadeIn>

    {/* All Blogs Section */}
    <FadeIn>
      <section className="py-16 bg-background">
        <div className="container-custom section-padding">
          <h2 className="text-primary text-center mb-8">{t("blog.list.allArticles")}</h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-2 rounded-full border border-border hover:border-primary text-sm font-medium transition-all ${activeCategory === category ? "bg-primary text-primary-foreground" : "bg-background text-primary"}`}>
              {CATEGORY_LABEL_KEYS[category] ? t(CATEGORY_LABEL_KEYS[category]) : category}
            </button>)}
          </div>

          {/* Blog Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post, index) => <FadeIn key={post.id} delay={index * 100}>
                  <article className="group bg-inherit">
                    <div className="relative rounded-2xl overflow-hidden mb-4">
                      <Link to={`/blog/${post.slug}`}>
                        <img src={post.image_url || blogFallbackImage} alt={post.title} className="w-full h-[340px] object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" />
                      </Link>
                      <span className="absolute top-4 left-4 bg-tertiary text-primary text-xs font-medium px-3 py-1 rounded-full pointer-events-none">
                        {post.category}
                      </span>
                      <ShareMenu post={post} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h5 className="text-foreground font-bold mb-3 group-hover:text-secondary transition-colors cursor-pointer">
                        {post.title}
                      </h5>
                    </Link>
                    <p className="text-muted-foreground font-medium text-base">
                      {new Date(post.created_at).toLocaleDateString(dateLocale, { month: 'long', day: 'numeric', year: 'numeric' })} · {post.read_time}
                    </p>
                  </article>
              </FadeIn>)}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted rounded-3xl">
              <p className="text-muted-foreground text-lg font-medium">{t("blog.list.empty")}</p>
            </div>
          )}
        </div>
      </section>
    </FadeIn>

    <FadeIn>
      <CTA />
    </FadeIn>
    <Footer />
  </div>;
};
export default Blog;
