import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useUserQuoteRequests } from "@/hooks/useQuoteRequests";
import { useExchangeRates, DEFAULT_EXCHANGE_RATES } from "@/hooks/usePricing";
import { formatCurrency, toCurrency } from "@/lib/currency";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, DollarSign, Plus, Wrench } from "lucide-react";
import { LocalizedLink as Link } from "@/components/LocalizedLink";

const urgencyLabels: Record<string, string> = {
  standard: "Standard",
  urgent: "Urgent",
  emergency: "Très urgent",
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">En attente</Badge>;
    case "contacted":
      return <Badge className="bg-purple-600 text-white">Contacté</Badge>;
    case "completed":
      return <Badge className="bg-green-600 text-white">Terminé</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Annulé</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function UserQuotes() {
  const { user } = useAuth();
  const { data: quotes, isLoading } = useUserQuoteRequests(user?.id);
  const { data: exchangeRates = DEFAULT_EXCHANGE_RATES } = useExchangeRates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Mes devis</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et suivez vos demandes de devis
          </p>
        </div>
        <Link to="/quote">
          <Button className="rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Demander un devis
          </Button>
        </Link>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Vos demandes de devis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement de vos devis...</p>
            </div>
          ) : quotes && quotes.length > 0 ? (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="border border-border rounded-xl p-4 bg-muted transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wrench className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary">
                            {quote.service_title}
                          </h3>
                          <p className="text-sm text-secondary">
                            {quote.complexity_label}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pl-13">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {quote.estimated_hours} jour{quote.estimated_hours > 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(quote.estimated_min, toCurrency(quote.currency), exchangeRates)} - {formatCurrency(quote.estimated_max, toCurrency(quote.currency), exchangeRates)}
                        </span>
                        <span>{urgencyLabels[quote.urgency] || quote.urgency}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(quote.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(quote.created_at), "d MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                  </div>

                  {quote.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Notes :</span> {quote.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground/80 mb-2">Aucun devis pour le moment</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez encore demandé aucun devis. Commencez en demandant votre premier devis.
              </p>
              <Link to="/quote">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Demander votre premier devis
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
