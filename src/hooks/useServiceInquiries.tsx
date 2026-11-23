import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ServiceInquiry {
  id: string;
  service_name: string;
  full_name: string;
  phone: string;
  note: string | null;
  status: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceInquiryInsert {
  service_name: string;
  full_name: string;
  phone: string;
  note?: string | null;
  user_id?: string | null;
}

// Fetch all service inquiries (admin)
export const useServiceInquiries = () => {
  return useQuery({
    queryKey: ["service-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ServiceInquiry[];
    },
  });
};

// Create service inquiry (public)
export const useCreateServiceInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiry: ServiceInquiryInsert) => {
      // For public/anonymous submissions we don't need to read the inserted row back.
      // Returning a representation would require SELECT access, which we intentionally restrict.
      const { error } = await supabase
        .from("service_inquiries")
        .insert([inquiry]);

      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["user-service-inquiries"] });
      toast.success("Demande envoyée avec succès ! Nous vous contacterons bientôt.");
    },
    onError: (error) => {
      toast.error(`Échec de l'envoi de la demande : ${error.message}`);
    },
  });
};

// Update service inquiry status (admin)
export const useUpdateServiceInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("service_inquiries")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-inquiries"] });
      toast.success("Statut de la demande mis à jour");
    },
    onError: (error) => {
      toast.error(`Échec de la mise à jour : ${error.message}`);
    },
  });
};

// Delete service inquiry (admin)
export const useDeleteServiceInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("service_inquiries").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-inquiries"] });
      toast.success("Demande supprimée");
    },
    onError: (error) => {
      toast.error(`Échec de la suppression : ${error.message}`);
    },
  });
};

// Fetch user's own service inquiries
export const useUserServiceInquiries = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-service-inquiries", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("service_inquiries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ServiceInquiry[];
    },
    enabled: !!userId,
  });
};
