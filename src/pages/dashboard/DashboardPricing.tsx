import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  useServicePricing, 
  useExchangeRates, 
  useUpdateServicePricing, 
  useUpdateExchangeRates 
} from "@/hooks/usePricing";
import { services } from "@/data/services";
import { Save, RefreshCw, DollarSign, Euro, MapPin, Globe } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const DashboardPricing = () => {
  const { data: dynamicPricing, isLoading: isPricingLoading, refetch: refetchPricing } = useServicePricing();
  const { data: exchangeRates, isLoading: isRatesLoading, refetch: refetchRates } = useExchangeRates();
  
  const updatePricingMutation = useUpdateServicePricing();
  const updateRatesMutation = useUpdateExchangeRates();

  const [rates, setRates] = useState({ EUR: 655.957, USD: 600 });
  const [pricingState, setPricingState] = useState<Record<string, { local: number, intl: number }>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize state from fetched data or static fallback
  useEffect(() => {
    if (exchangeRates) {
      setRates(exchangeRates);
    }
  }, [exchangeRates]);

  useEffect(() => {
    const initialState: Record<string, { local: number, intl: number }> = {};
    services.forEach(s => {
      const dbPrice = dynamicPricing?.find(p => p.slug === s.slug);
      initialState[s.slug] = {
        local: dbPrice?.local_tjm ?? s.localTJM,
        intl: dbPrice?.intl_tjm ?? s.intlTJM,
      };
    });
    setPricingState(initialState);
  }, [dynamicPricing]);

  const handleRateChange = (currency: 'EUR' | 'USD', value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setRates(prev => ({ ...prev, [currency]: num }));
    }
  };

  const handlePricingChange = (slug: string, type: 'local' | 'intl', value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setPricingState(prev => ({
        ...prev,
        [slug]: {
          ...prev[slug],
          [type]: num
        }
      }));
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Save Exchange Rates
      if (rates.EUR !== exchangeRates?.EUR || rates.USD !== exchangeRates?.USD) {
        await updateRatesMutation.mutateAsync(rates);
      }

      // Save Pricing
      const pricingPromises = services.map(s => {
        const current = pricingState[s.slug];
        const dbPrice = dynamicPricing?.find(p => p.slug === s.slug);
        
        // Only update if changed from DB (or if not in DB yet)
        if (!dbPrice || dbPrice.local_tjm !== current.local || dbPrice.intl_tjm !== current.intl) {
          return updatePricingMutation.mutateAsync({
            slug: s.slug,
            local_tjm: current.local,
            intl_tjm: current.intl
          });
        }
        return Promise.resolve();
      });

      await Promise.all(pricingPromises);
      
      toast.success("Tous les tarifs et paramètres ont été mis à jour avec succès.");
      refetchPricing();
      refetchRates();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      toast.error("Erreur lors de la sauvegarde des modifications.");
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isPricingLoading || isRatesLoading;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Tarifs & Devises</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les Taux Journaliers Moyens (TJM) de vos services et les taux de change.
          </p>
        </div>
        <Button 
          onClick={handleSaveAll} 
          disabled={isSaving || isLoading}
          className="w-full sm:w-auto flex items-center gap-2"
          size="lg"
        >
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? "Sauvegarde..." : "Sauvegarder tout"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary opacity-50" />
        </div>
      ) : (
        <FadeIn>
          <div className="grid gap-8">
            {/* Exchange Rates Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Taux de Change Globaux
                </CardTitle>
                <CardDescription>
                  Ces taux sont utilisés pour convertir dynamiquement le TJM International (défini en FCFA) en Euros et Dollars pour les clients internationaux.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="eur-rate" className="text-sm font-semibold flex items-center gap-2">
                    <Euro className="h-4 w-4" /> 
                    Valeur de 1 Euro (EUR) en FCFA
                  </Label>
                  <Input 
                    id="eur-rate"
                    type="number"
                    step="0.001"
                    value={rates.EUR}
                    onChange={(e) => handleRateChange('EUR', e.target.value)}
                    className="font-mono text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="usd-rate" className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> 
                    Valeur de 1 Dollar (USD) en FCFA
                  </Label>
                  <Input 
                    id="usd-rate"
                    type="number"
                    step="0.001"
                    value={rates.USD}
                    onChange={(e) => handleRateChange('USD', e.target.value)}
                    className="font-mono text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Services Pricing List */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-primary px-1">Tarifs des Services (TJM)</h2>
              
              <div className="grid gap-6">
                {services.map((service, index) => {
                  const localPrice = pricingState[service.slug]?.local ?? service.localTJM;
                  const intlPrice = pricingState[service.slug]?.intl ?? service.intlTJM;

                  return (
                    <Card key={service.slug} className="overflow-hidden border-border/50 transition-shadow hover:shadow-md">
                      <div className="bg-primary/5 p-4 border-b">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-3">
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-md">{service.number}</span>
                          {service.title}
                        </h3>
                      </div>
                      <CardContent className="p-6">
                        <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <Label className="flex items-center gap-2 font-semibold">
                              <MapPin className="h-4 w-4 text-emerald-600" />
                              TJM Marché Local (FCFA)
                            </Label>
                            <div className="relative">
                              <Input 
                                type="number"
                                value={localPrice}
                                onChange={(e) => handlePricingChange(service.slug, 'local', e.target.value)}
                                className="pl-4 pr-16 font-mono text-base h-12"
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                FCFA
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Appliqué aux clients d'Afrique Centrale</p>
                          </div>
                          
                          <div className="space-y-3">
                            <Label className="flex items-center gap-2 font-semibold">
                              <Globe className="h-4 w-4 text-blue-600" />
                              TJM Marché International (FCFA)
                            </Label>
                            <div className="relative">
                              <Input 
                                type="number"
                                value={intlPrice}
                                onChange={(e) => handlePricingChange(service.slug, 'intl', e.target.value)}
                                className="pl-4 pr-16 font-mono text-base h-12"
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                FCFA
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Sera converti en EUR/USD pour les clients internationaux</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
};

export default DashboardPricing;
