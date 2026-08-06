import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ServicePricing {
  id: string;
  slug: string;
  title: string;
  local_tjm: number;
  intl_tjm: number;
  updated_at: string;
}

export interface SystemSettings {
  key: string;
  value: Record<string, unknown>;
  description: string;
  updated_at: string;
}

export interface ExchangeRates {
  EUR: number;
  USD: number;
}

export const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  EUR: 655.957,
  USD: 600,
};

// Fetch all service pricing (public)
export const useServicePricing = () => {
  return useQuery({
    queryKey: ['service_pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_pricing')
        .select('*');
      
      // If table doesn't exist yet or errors, return empty array
      if (error) {
        console.error("Error fetching service pricing:", error);
        return [] as ServicePricing[];
      }
      return data as ServicePricing[];
    },
  });
};

// Fetch exchange rates from settings (public)
export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['system_settings', 'exchange_rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'exchange_rates')
        .maybeSingle();
      
      if (error || !data) {
        return DEFAULT_EXCHANGE_RATES;
      }
      return data.value as unknown as ExchangeRates;
    },
  });
};

// Create or update service pricing (admin only).
// Uses upsert instead of update so that adding a new service to
// src/data/services.ts without a matching DB row no longer breaks the
// "save all" flow in DashboardPricing.tsx (update() on a non-existent
// slug matches zero rows and .single() throws).
export const useUpdateServicePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { slug: string; title: string; local_tjm: number; intl_tjm: number }) => {
      const { data, error } = await supabase
        .from('service_pricing')
        .upsert(
          {
            slug: updates.slug,
            title: updates.title,
            local_tjm: updates.local_tjm,
            intl_tjm: updates.intl_tjm,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'slug' },
        )
        .select()
        .single();

      if (error) throw error;
      return data as ServicePricing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_pricing'] });
    },
  });
};

// Create or update exchange rates (admin only). Same upsert rationale
// as useUpdateServicePricing above.
export const useUpdateExchangeRates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rates: ExchangeRates) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert(
          {
            key: 'exchange_rates',
            value: rates as unknown as Json,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' },
        )
        .select()
        .single();

      if (error) throw error;
      return data as SystemSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_settings', 'exchange_rates'] });
    },
  });
};
