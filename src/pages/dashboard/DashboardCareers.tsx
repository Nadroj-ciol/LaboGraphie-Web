import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAdminCareers, useCreateCareer, useDeleteCareer, useUpdateCareer } from "@/hooks/useCareers";
import { format } from "date-fns";
import { Loader2, Pencil, Plus, Trash2, Briefcase, MapPin, ListPlus, Building2 } from "lucide-react";
import { useState } from "react";

const DashboardCareers = () => {
  const { data: careers, isLoading } = useAdminCareers();
  const createCareer = useCreateCareer();
  const updateCareer = useUpdateCareer();
  const deleteCareer = useDeleteCareer();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "Full-time",
    location: "",
    about_the_role: "",
    short_term_goals: "",
    what_you_bring: "",
    why_you_might_love: "",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      type: "Full-time",
      location: "",
      about_the_role: "",
      short_term_goals: "",
      what_you_bring: "",
      why_you_might_love: "",
      is_active: true,
    });
    setEditingCareer(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const careerData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      type: formData.type,
      location: formData.location,
      about_the_role: formData.about_the_role.split("\n").filter((l) => l.trim().length > 0),
      short_term_goals: formData.short_term_goals.split("\n").filter((l) => l.trim().length > 0),
      what_you_bring: formData.what_you_bring.split("\n").filter((l) => l.trim().length > 0),
      why_you_might_love: formData.why_you_might_love.split("\n").filter((l) => l.trim().length > 0),
      is_active: formData.is_active,
    };

    if (editingCareer) {
      await updateCareer.mutateAsync({ id: editingCareer, updates: careerData });
    } else {
      await createCareer.mutateAsync(careerData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (career: any) => {
    setFormData({
      title: career.title,
      slug: career.slug,
      type: career.type,
      location: career.location,
      about_the_role: career.about_the_role.join("\n"),
      short_term_goals: career.short_term_goals.join("\n"),
      what_you_bring: career.what_you_bring.join("\n"),
      why_you_might_love: career.why_you_might_love.join("\n"),
      is_active: career.is_active,
    });
    setEditingCareer(career.id);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-primary">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Offres d'emploi</h1>
          <p className="text-black mt-1">
            Gérez vos postes ouverts et recrutements
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }} >
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un poste
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl p-0">
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold">
                  {editingCareer ? "Modifier l'offre" : "Créer une offre d'emploi"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">Détaillez le poste et les prérequis pour attirer les meilleurs talents.</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} className="rounded-lg text-slate-700 hover:text-primary">
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={createCareer.isPending || updateCareer.isPending} className="rounded-lg shadow-sm">
                  {(createCareer.isPending || updateCareer.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCareer ? "Mettre à jour" : "Publier l'offre"}
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Colonne de gauche : Infos Générales */}
                <div className="space-y-6">
                  
                  <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 border-b pb-2 mb-2">
                      <Briefcase className="w-4 h-4" /> Informations de base
                    </h3>
                    
                    <div>
                      <Label className="text-sm font-medium">Titre du poste *</Label>
                      <Input 
                        value={formData.title} 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} 
                        placeholder="ex: Développeur Full-Stack Senior"
                        className="mt-1 bg-white" 
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Type de contrat</Label>
                        <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                          <SelectTrigger className="mt-1 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-time">Temps plein</SelectItem>
                            <SelectItem value="Part-time">Temps partiel</SelectItem>
                            <SelectItem value="Contract">Freelance / Contrat</SelectItem>
                            <SelectItem value="Internship">Stage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Lieu *</Label>
                        <Input 
                          value={formData.location} 
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                          placeholder="ex: Abidjan, CI (ou Remote)"
                          className="mt-1 bg-white" 
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">URL Slug (Généré auto)</Label>
                      <Input 
                        value={formData.slug} 
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                        placeholder="developpeur-senior" 
                        className="bg-white text-sm font-mono text-muted-foreground h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                     <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 border-b pb-2 mb-2">
                      <Building2 className="w-4 h-4" /> Statut de l'annonce
                    </h3>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <div className="space-y-0.5">
                        <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">Offre active</Label>
                        <p className="text-xs text-muted-foreground">Visible par les candidats sur le site</p>
                      </div>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                    </div>
                  </div>

                </div>

                {/* Colonne de droite : Listes de critères */}
                <div className="space-y-6">
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-sm text-primary flex gap-3">
                    <ListPlus className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Format des listes</p>
                      <p className="opacity-90 mt-1">Pour les champs ci-dessous, <strong>chaque retour à la ligne</strong> créera automatiquement une nouvelle puce (bullet point) sur le site.</p>
                    </div>
                  </div>

                  <div className="space-y-5 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">À propos du poste</Label>
                      <Textarea 
                        value={formData.about_the_role} 
                        onChange={(e) => setFormData({ ...formData, about_the_role: e.target.value })} 
                        rows={3} 
                        className="bg-white resize-y"
                        placeholder="• Responsabilité 1&#10;• Responsabilité 2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Ce que vous apportez (Prérequis)</Label>
                      <Textarea 
                        value={formData.what_you_bring} 
                        onChange={(e) => setFormData({ ...formData, what_you_bring: e.target.value })} 
                        rows={3} 
                        className="bg-white resize-y"
                        placeholder="• Compétence 1&#10;• Compétence 2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Objectifs à court terme</Label>
                      <Textarea 
                        value={formData.short_term_goals} 
                        onChange={(e) => setFormData({ ...formData, short_term_goals: e.target.value })} 
                        rows={3} 
                        className="bg-white resize-y"
                        placeholder="• Objectif 1&#10;• Objectif 2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Pourquoi vous allez adorer travailler ici</Label>
                      <Textarea 
                        value={formData.why_you_might_love} 
                        onChange={(e) => setFormData({ ...formData, why_you_might_love: e.target.value })} 
                        rows={3} 
                        className="bg-white resize-y"
                        placeholder="• Avantage 1&#10;• Avantage 2"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl">
        <CardHeader className="border-b border-gray-100 bg-gray-50/30 rounded-t-2xl pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5 text-primary" />
            Tous les postes <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">{careers?.length || 0}</span>
          </CardTitle>
          <CardDescription>Consultez et gérez les offres d'emploi affichées sur votre site internet.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {careers && careers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {careers.map((career) => (
                <div 
                  key={career.id} 
                  className="group relative flex flex-col bg-white border border-gray-200 rounded-xl p-5 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEdit(career)} 
                        className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-primary/5 hover:border-primary/20 bg-white shadow-sm"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-slate-500 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 bg-white shadow-sm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Cela supprimera définitivement l'offre "{career.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white text-slate-700">Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCareer.mutate(career.id)} className="bg-destructive text-white hover:bg-destructive/90">
                              Supprimer l'offre
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </div>

                  <div className="mb-4 pr-16">
                    <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-primary transition-colors">{career.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="bg-gray-50 font-normal text-xs text-slate-600 border-gray-200">
                        {career.type === 'Full-time' ? 'Temps plein' : career.type === 'Part-time' ? 'Temps partiel' : career.type === 'Internship' ? 'Stage' : 'Freelance'}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50 font-normal text-xs text-slate-600 border-gray-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {career.location}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Ajouté le {format(new Date(career.created_at), "dd/MM/yyyy")}
                    </span>
                    <Badge 
                      variant={career.is_active ? "default" : "secondary"}
                      className={`font-medium ${career.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500"}`}
                    >
                      {career.is_active ? "En ligne" : "Fermé"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-700">Aucune offre d'emploi</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Commencez par ajouter votre premier poste ouvert en cliquant sur le bouton ci-dessus.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCareers;
