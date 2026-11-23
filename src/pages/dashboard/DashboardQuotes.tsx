/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useAllQuoteRequests, useDeleteQuoteRequest, useUpdateQuoteRequestStatus } from "@/hooks/useQuoteRequests";
import { useExchangeRates, DEFAULT_EXCHANGE_RATES } from "@/hooks/usePricing";
import { formatCurrency, toCurrency } from "@/lib/currency";
import { Calendar, Clock, DollarSign, Mail, Phone, Trash2 } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  contacted: "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
};

const urgencyColors: Record<string, string> = {
  emergency: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  urgent: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  standard: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
};

const urgencyLabels: Record<string, string> = {
  standard: "Standard",
  urgent: "Urgent",
  emergency: "Très urgent",
};

export default function DashboardQuotes() {
  const { isAdmin, loading } = useAuth();
  const navigate = useLocalizedNavigate();
  const { data: quoteRequests, isLoading } = useAllQuoteRequests();
  const updateQuoteStatus = useUpdateQuoteRequestStatus();
  const deleteQuoteRequest = useDeleteQuoteRequest();
  const { data: exchangeRates = DEFAULT_EXCHANGE_RATES } = useExchangeRates();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredQuotes = (quoteRequests || []).filter(
    (q) => statusFilter === "all" || q.status === statusFilter,
  );

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, loading, navigate]);

  const handleDeleteQuote = async (id: string) => {

    try {
      await deleteQuoteRequest.mutateAsync(id);
      toast.success("Demande de devis supprimée avec succès");
    } catch (error: any) {
      toast.error(error.message || "Échec de la suppression de la demande de devis");
    }
  };

  const handleQuoteStatusChange = async (id: string, status: string) => {
    try {
      await updateQuoteStatus.mutateAsync({ id, status });
      toast.success("Statut mis à jour");
    } catch (error: any) {
      toast.error(error.message || "Échec de la mise à jour du statut");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Demandes de devis</h1>
        <p className="text-foreground mt-1">
          Gérez les demandes de devis des clients
        </p>
      </div>

      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tous les devis ({filteredQuotes.length})
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "Tous" },
              { value: "pending", label: "En attente" },
              { value: "contacted", label: "Contacté" },
              { value: "completed", label: "Terminé" },
              { value: "cancelled", label: "Annulé" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-primary">Chargement...</div>
          ) : filteredQuotes.length > 0 ? (
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-border bg-muted"
                >
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-accent" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-primary">{quote.full_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyColors[quote.urgency] || "bg-muted text-muted-foreground"}`}>
                        {urgencyLabels[quote.urgency] || quote.urgency}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary">{quote.service_title}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {quote.phone}
                      </span>
                      {quote.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {quote.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quote.estimated_hours} jour{quote.estimated_hours > 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(quote.created_at).toLocaleDateString("fr-FR")}
                      </span>
                      {quote.service_date && (
                        <span className="flex items-center gap-1 text-primary/80 font-medium">
                          Souhaité : {new Date(quote.service_date).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complexité : {quote.complexity_label}
                    </p>
                    {quote.notes && (
                      <p className="text-sm text-foreground/80 bg-background/60 rounded-md px-3 py-2 mt-2 border border-border/60">
                        <span className="font-medium">Note client :</span> {quote.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(quote.estimated_min, toCurrency(quote.currency), exchangeRates)} - {formatCurrency(quote.estimated_max, toCurrency(quote.currency), exchangeRates)}
                    </p>
                    <div className="flex items-center gap-3">
                      <select
                        value={quote.status}
                        onChange={(e) => handleQuoteStatusChange(quote.id, e.target.value)}
                        className={`text-xs px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusColors[quote.status] || "bg-muted text-muted-foreground"}`}
                      >
                        <option value="pending">En attente</option>
                        <option value="contacted">Contacté</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                      </select>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group">
                            <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Cela supprimera définitivement cette demande de devis.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-card text-muted-foreground">Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteQuote(quote.id)} className="bg-destructive text-white hover:bg-destructive/90">
                              Supprimer
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
            <div className="text-center py-8 text-muted-foreground">
              Aucune demande de devis pour le moment.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
