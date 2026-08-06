import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useAllBlogs } from "@/hooks/useBlogs";
import { useAllContacts } from "@/hooks/useContacts";
import { useJobApplications } from "@/hooks/useJobApplications";
import { useAllQuoteRequests, useUserQuoteRequests } from "@/hooks/useQuoteRequests";
import { useServiceInquiries } from "@/hooks/useServiceInquiries";
import { Briefcase, Clock, DollarSign, FileText, Mail, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";

function formatFCFA(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

function AdminOverview() {
  const { data: contacts } = useAllContacts();
  const { data: quoteRequests } = useAllQuoteRequests();
  const { data: blogs } = useAllBlogs();
  const { data: applications } = useJobApplications();
  const { data: serviceInquiries } = useServiceInquiries();

  const newContacts = contacts?.filter(c => c.status === "new").length || 0;
  const pendingQuotes = quoteRequests?.filter(q => q.status === "pending").length || 0;
  const publishedBlogs = blogs?.filter(b => b.published).length || 0;
  const pendingApplications = applications?.filter(a => a.status === "pending").length || 0;
  const newInquiries = serviceInquiries?.filter(i => i.status === "new").length || 0;

  const stats = [
    {
      title: "Total messages",
      value: contacts?.length || 0,
      description: `${newContacts} nouveaux cette semaine`,
      icon: Mail,
    },
    {
      title: "Demandes de devis",
      value: quoteRequests?.length || 0,
      description: `${pendingQuotes} en attente`,
      icon: DollarSign,
    },
    {
      title: "Demandes de service",
      value: serviceInquiries?.length || 0,
      description: `${newInquiries} nouvelles`,
      icon: MessageSquare,
    },
    {
      title: "Candidatures",
      value: applications?.length || 0,
      description: `${pendingApplications} en attente`,
      icon: Briefcase,
    },
    {
      title: "Articles",
      value: blogs?.length || 0,
      description: `${publishedBlogs} publiés`,
      icon: FileText,
    },
  ];

  const recentContacts = contacts?.slice(0, 5) || [];
  const recentQuotes = quoteRequests?.slice(0, 5) || [];
  const recentApplications = applications?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Vue d'ensemble</h1>
        <p className="text-black mt-1">
          Suivez vos indicateurs et votre activité récente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <Card key={stat.title} className="group bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Messages récents
            </CardTitle>
            <CardDescription>Derniers messages reçus via le formulaire de contact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContacts.length > 0 ? (
                recentContacts.slice(0, 3).map((contact) => (
                  <div key={contact.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {contact.full_name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contact.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.service || "Demande générale"}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(contact.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun message pour le moment</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Demandes de devis récentes
            </CardTitle>
            <CardDescription>Dernières demandes de devis des clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotes.length > 0 ? (
                recentQuotes.slice(0, 3).map((quote) => (
                  <div key={quote.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{quote.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{quote.service_title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">
                        {formatFCFA(quote.estimated_min)} - {formatFCFA(quote.estimated_max)}
                      </p>
                      <p className="text-xs text-muted-foreground">{quote.urgency}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune demande de devis pour le moment</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Candidatures récentes
            </CardTitle>
            <CardDescription>Dernières candidatures reçues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.slice(0, 3).map((application) => (
                  <div key={application.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-secondary">
                        {application.full_name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{application.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{application.job_title}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        application.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        application.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                        application.status === 'interviewed' ? 'bg-purple-100 text-purple-800' :
                        application.status === 'hired' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-700'
                        }`}>
                        {{
                          pending: 'En attente',
                          reviewed: 'Examinée',
                          interviewed: 'En entretien',
                          hired: 'Recruté',
                          rejected: 'Refusé',
                        }[application.status] ?? application.status}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune candidature pour le moment</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserOverview() {
  const { user } = useAuth();
  const { data: userQuotes } = useUserQuoteRequests(user?.id);

  const totalQuotes = userQuotes?.length || 0;
  const pendingQuotes = userQuotes?.filter(q => q.status === "pending").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Mon tableau de bord</h1>
        <p className="text-black mt-1">
          Consultez votre activité et gérez votre compte
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-medium text-slate-600">
              Mes devis
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalQuotes === 0 ? "Aucune demande de devis pour le moment" : `${totalQuotes} devis au total`}
            </p>
          </CardContent>
        </Card>

        <Card className="group bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-medium text-slate-600">
              Demandes en attente
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingQuotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingQuotes === 0 ? "Toutes les demandes sont traitées" : `${pendingQuotes} en attente d'examen`}
            </p>
          </CardContent>
        </Card>

        <Card className="group bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-medium text-slate-600">
              Statut du compte
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-green-500 group-hover:bg-green-100 transition-colors duration-300">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Actif</div>
            <p className="text-xs text-muted-foreground mt-1">
              Votre compte est en règle
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Tâches courantes que vous pourriez vouloir effectuer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/quote" className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Demander un devis</p>
                <p className="text-sm text-muted-foreground">Obtenez une estimation pour votre projet</p>
              </div>
            </Link>
            <Link to="/contact" className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Contactez-nous</p>
                <p className="text-sm text-muted-foreground">Entrez en contact avec notre équipe</p>
              </div>
            </Link>
            <Link to="/services" className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Voir les services</p>
                <p className="text-sm text-muted-foreground">Découvrez ce que nous proposons</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardOverview() {
  const { isAdmin, loading } = useAuth();

  return (
    <>
      {!loading && (isAdmin ? <AdminOverview /> : <UserOverview />)}
    </>
  );
}
