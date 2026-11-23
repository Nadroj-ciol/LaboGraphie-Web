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
import { useEffect } from "react";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  contacted: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const urgencyColors: Record<string, string> = {
  emergency: "bg-red-100 text-red-700",
  urgent: "bg-amber-100 text-amber-700",
  standard: "bg-blue-100 text-blue-700",
};

export default function DashboardQuotes() {
  const { isAdmin, loading } = useAuth();
  const navigate = useLocalizedNavigate();
  const { data: quoteRequests, isLoading } = useAllQuoteRequests();
  const updateQuoteStatus = useUpdateQuoteRequestStatus();
  const deleteQuoteRequest = useDeleteQuoteRequest();
  const { data: exchangeRates = DEFAULT_EXCHANGE_RATES } = useExchangeRates();

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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tous les devis ({quoteRequests?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-primary">Chargement...</div>
          ) : quoteRequests && quoteRequests.length > 0 ? (
            <div className="space-y-4">
              {quoteRequests.map((quote) => (
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
                        {quote.urgency}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary">{quote.service_title}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-primary">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {quote.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {quote.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quote.estimated_hours} jour{quote.estimated_hours > 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(quote.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-primary">
                      Complexité : {quote.complexity_label}
                    </p>
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
            <div className="text-center py-8 text-muted-primary">
              Aucune demande de devis pour le moment.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
