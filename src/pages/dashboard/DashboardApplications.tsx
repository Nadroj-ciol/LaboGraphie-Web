import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JobApplication, useJobApplications, useUpdateJobApplication } from "@/hooks/useJobApplications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Building2, Download, ExternalLink, FileText, Linkedin, Loader2, Mail, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  reviewed: "outline",
  interviewed: "default",
  hired: "default",
  rejected: "destructive",
};

const DashboardApplications = () => {
  const { data: applications, isLoading } = useJobApplications();
  const updateApplication = useUpdateJobApplication();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const filteredApps = useMemo(() => {
    if (!applications) return [];
    return applications.filter(app => {
      const matchesSearch = app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || app.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      const matchesJob = jobFilter === "all" || app.job_title === jobFilter;
      return matchesSearch && matchesStatus && matchesJob;
    });
  }, [applications, searchQuery, statusFilter, jobFilter]);

  const uniqueJobs = useMemo(() => {
    if (!applications) return [];
    return Array.from(new Set(applications.map(a => a.job_title))).filter(Boolean);
  }, [applications]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">En attente</Badge>;
      case 'reviewed': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Examinée</Badge>;
      case 'interviewed': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 shadow-none border-none">En entretien</Badge>;
      case 'hired': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 shadow-none border-none">Recruté</Badge>;
      case 'rejected': return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 shadow-none border-none">Refusé</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderCV = (cvLink: string | null) => {
    if (!cvLink) return <p className="text-sm text-muted-foreground italic">Aucun CV fourni</p>;
    
    const isBase64 = cvLink.startsWith('data:');
    
    if (isBase64) {
      return (
        <a href={cvLink} download="CV_Candidat" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
          <Download className="h-4 w-4" />
          Télécharger le fichier joint
        </a>
      );
    }
    
    return (
      <a href={cvLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
        <ExternalLink className="h-4 w-4" />
        Ouvrir le lien externe
      </a>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Candidatures</h1>
          <p className="text-muted-foreground mt-1">Gérez et suivez les candidats à vos offres d'emploi</p>
        </div>
      </div>

      <Card className="bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl">
        <CardHeader className="border-b border-gray-100 bg-gray-50/30 rounded-t-2xl pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">
              Toutes les candidatures <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full ml-2">{filteredApps?.length || 0}</span>
            </CardTitle>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher (nom, email)..."
                  className="pl-9 bg-white w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-white">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="reviewed">Examinée</SelectItem>
                  <SelectItem value="interviewed">En entretien</SelectItem>
                  <SelectItem value="hired">Recruté</SelectItem>
                  <SelectItem value="rejected">Refusé</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="w-[200px] bg-white truncate">
                  <SelectValue placeholder="Poste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les postes</SelectItem>
                  {uniqueJobs.map(job => (
                    <SelectItem key={job} value={job}>{job}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700 py-4 px-6">Candidat</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Poste</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Reçu le</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Statut</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Aucune candidature ne correspond à vos critères.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApps.map((app) => (
                  <TableRow key={app.id} className="border-gray-100 hover:bg-gray-50/50 cursor-pointer transition-colors" onClick={() => setSelectedApp(app)}>
                    <TableCell className="px-6 py-4">
                      <div className="font-medium text-slate-900">{app.full_name}</div>
                      <div className="text-sm text-muted-foreground">{app.email}</div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">{app.job_title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      Il y a {formatDistanceToNow(new Date(app.created_at), { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto w-full bg-white">
          {selectedApp && (
            <>
              <SheetHeader className="mb-6 border-b pb-6">
                <SheetTitle className="text-2xl font-bold flex items-center justify-between">
                  {selectedApp.full_name}
                </SheetTitle>
                <SheetDescription className="text-base text-primary font-medium mt-1">
                  Candidat(e) pour le poste : {selectedApp.job_title}
                </SheetDescription>
                
                <div className="mt-4 flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">Changer le statut :</span>
                  <Select
                    value={selectedApp.status}
                    onValueChange={(value) => {
                      updateApplication.mutate({ id: selectedApp.id, status: value });
                      setSelectedApp({ ...selectedApp, status: value });
                    }}
                  >
                    <SelectTrigger className="w-[180px] bg-white font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="reviewed">Examinée</SelectItem>
                      <SelectItem value="interviewed">Entretien prévu</SelectItem>
                      <SelectItem value="hired">Recruté(e)</SelectItem>
                      <SelectItem value="rejected">Refusé(e)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SheetHeader>

              <div className="space-y-8">
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Coordonnées</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a href={`mailto:${selectedApp.email}`} className="text-sm font-medium hover:underline">{selectedApp.email}</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Téléphone</p>
                        <a href={`tel:${selectedApp.phone}`} className="text-sm font-medium hover:underline">{selectedApp.phone}</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pro Info */}
                {(selectedApp.current_company || selectedApp.linkedin_url) && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Profil Professionnel</h3>
                    <div className="space-y-3">
                      {selectedApp.current_company && (
                        <div className="flex items-center gap-3 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-slate-700">Entreprise actuelle :</span>
                          <span>{selectedApp.current_company}</span>
                        </div>
                      )}
                      {selectedApp.linkedin_url && (
                        <div className="flex items-center gap-3 text-sm">
                          <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                          <span className="font-medium text-slate-700">LinkedIn :</span>
                          <a href={selectedApp.linkedin_url.startsWith('http') ? selectedApp.linkedin_url : `https://${selectedApp.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[300px]">
                            {selectedApp.linkedin_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Note / Cover Letter */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Note / Motivation</h3>
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                    {selectedApp.note ? (
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedApp.note}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Aucune note fournie par le candidat.</p>
                    )}
                  </div>
                </div>

                {/* CV */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Curriculum Vitae (CV)
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                    {renderCV(selectedApp.cv_link)}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardApplications;
