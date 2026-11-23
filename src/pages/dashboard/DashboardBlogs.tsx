import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  Blog,
  BlogInsert,
  useAllBlogs,
  useCreateBlog,
  useDeleteBlog,
  useUpdateBlog,
} from "@/hooks/useBlogs";
import { Edit2, Eye, EyeOff, FileText, Plus, Trash2, Calendar, Clock, LayoutGrid, Search, Filter, ExternalLink } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BlogImageUpload } from "@/components/dashboard/BlogImageUpload";

const categories = ["Design & Branding", "Marketing Digital", "Cyber-sécurité", "Maintenance", "Réseau", "Histoire"];

// Quill editor configuration
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "color",
  "background",
  "link",
  "image",
];

export default function DashboardBlogs() {
  const { isAdmin, loading } = useAuth();
  const navigate = useLocalizedNavigate();
  const { data: blogs, isLoading } = useAllBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Toutes");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<Partial<BlogInsert>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    category: "Design & Branding",
    read_time: "5 min read",
    is_featured: false,
    published: false,
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, loading, navigate]);

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      category: "Design & Branding",
      read_time: "5 min read",
      is_featured: false,
      published: false,
    });
    setEditingBlog(null);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      image_url: blog.image_url || "",
      category: blog.category,
      read_time: blog.read_time || "5 min read",
      is_featured: blog.is_featured || false,
      published: blog.published || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("Le titre et le slug sont requis");
      return;
    }

    try {
      if (editingBlog) {
        await updateBlog.mutateAsync({
          id: editingBlog.id,
          updates: formData,
        });
        toast.success("Article mis à jour avec succès");
      } else {
        await createBlog.mutateAsync(formData as BlogInsert);
        toast.success("Article créé avec succès");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Échec de l'enregistrement de l'article");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteBlog.mutateAsync(id);
      toast.success("Article supprimé avec succès");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Échec de la suppression de l'article");
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    return blogs.filter((blog) => {
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === "Toutes" || blog.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, filterCategory]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Articles</h1>
          <p className="text-foreground mt-1">
            Créez et gérez le contenu du blog
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-0 shadow-2xl rounded-2xl p-0">
            <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold">
                  {editingBlog ? "Modifier l'article" : "Créer un nouvel article"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">Rédigez votre contenu et configurez les paramètres de publication.</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="rounded-lg text-muted-foreground hover:text-primary"
                >
                  Annuler
                </Button>
                <Button type="button" onClick={handleSubmit} className="rounded-lg shadow-sm">
                  {editingBlog ? "Mettre à jour" : "Publier l'article"}
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Colonne de gauche : Rédaction (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                  <div className="space-y-4 bg-muted/50 p-6 rounded-xl border border-border">
                    <div>
                      <Label htmlFor="title" className="text-base font-semibold">Titre de l'article *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            title: e.target.value,
                            slug: generateSlug(e.target.value),
                          });
                        }}
                        placeholder="Ex: 5 astuces pour optimiser sa présence en ligne..."
                        className="mt-2 text-lg h-12 bg-card"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt" className="text-sm font-semibold text-muted-foreground">Extrait court (Résumé)</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        placeholder="Brève description qui s'affichera dans la liste des articles..."
                        className="mt-2 bg-card resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative z-0">
                    <Label htmlFor="content" className="text-base font-semibold">Contenu de l'article</Label>
                    <div className="mt-2 bg-card rounded-xl border overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={formData.content || ""}
                        onChange={(value) =>
                          setFormData({ ...formData, content: value })
                        }
                        modules={modules}
                        formats={formats}
                        placeholder="Rédigez le contenu de votre article ici..."
                        className="min-h-[400px]"
                      />
                    </div>
                  </div>

                </div>

                {/* Colonne de droite : Paramètres (1/3) */}
                <div className="space-y-6">

                  <div className="space-y-3 bg-muted/50 p-5 rounded-xl border border-border">
                    <Label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" /> Image de couverture
                    </Label>
                    <BlogImageUpload
                      url={formData.image_url || null}
                      onUpload={(url) => setFormData({ ...formData, image_url: url })}
                    />
                  </div>

                  <div className="space-y-4 bg-muted/50 p-5 rounded-xl border border-border">
                    <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2 mb-4">Méta-données</h3>

                    <div>
                      <Label htmlFor="category" className="text-xs text-muted-foreground mb-1 block">Catégorie</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg bg-card text-sm"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="read_time" className="text-xs text-muted-foreground mb-1 block">Temps de lecture</Label>
                      <Input
                        id="read_time"
                        value={formData.read_time || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, read_time: e.target.value })
                        }
                        placeholder="ex: 5 min"
                        className="bg-card text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug" className="text-xs text-muted-foreground mb-1 block">URL Slug (Généré auto)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        placeholder="slug-de-larticle"
                        className="bg-card text-sm font-mono text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 bg-muted/50 p-5 rounded-xl border border-border">
                    <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2 mb-4">Publication</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="published" className="text-sm">En ligne</Label>
                        <p className="text-xs text-muted-foreground">Rendre l'article public</p>
                      </div>
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, published: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="is_featured" className="text-sm">À la une</Label>
                        <p className="text-xs text-muted-foreground">Mettre en avant sur l'accueil</p>
                      </div>
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_featured: checked })
                        }
                      />
                    </div>
                  </div>

                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl">
        <CardHeader className="border-b border-border bg-muted/30 rounded-t-2xl pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Tous les articles <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">{blogs?.length || 0}</span>
          </CardTitle>
          <CardDescription>Gérez la liste de vos publications, mettez à jour le contenu ou modifiez l'état de publication.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un article par titre ou extrait..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>
            <div className="w-full sm:w-64 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-card text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Toutes">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-primary flex flex-col items-center gap-2">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              <p>Chargement des articles...</p>
            </div>
          ) : filteredBlogs && filteredBlogs.length > 0 ? (
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group flex flex-col md:flex-row md:items-stretch gap-5 p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
                >
                  {blog.image_url ? (
                    <div className="w-full md:w-32 h-32 md:h-auto rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full md:w-32 h-32 md:h-auto rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-dashed border-border">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">{blog.title}</h3>
                        {blog.is_featured && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 tracking-wider">
                            À la une
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {blog.excerpt || "Aucun extrait défini pour cet article."}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-4">
                      <span className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-md text-muted-foreground">
                        <LayoutGrid className="w-3.5 h-3.5" /> {blog.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {blog.read_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-between items-end gap-2 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4">
                    <span className={`flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full w-full md:w-auto ${blog.published ? "bg-green-50 text-green-700 border border-green-100" : "bg-muted text-muted-foreground border border-border"}`}>
                      {blog.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {blog.published ? "En ligne" : "Brouillon"}
                    </span>

                    <div className="flex items-center justify-end gap-2 w-full mt-auto">
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-colors"
                        title="Prévisualiser"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(blog)}
                        className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Cela supprimera définitivement l'article "{blog.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-card text-muted-foreground">Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteBlog(blog.id)} className="bg-destructive text-white hover:bg-destructive/90">
                              Supprimer l'article
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-muted-foreground">Aucun article trouvé</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Commencez par créer votre premier article en cliquant sur le bouton "Nouvel article" en haut à droite.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
