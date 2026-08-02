/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useAllContacts, useDeleteContact, useUpdateContactStatus } from "@/hooks/useContacts";
import { Calendar, Mail, Phone, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  contacted: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function DashboardContacts() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: contacts, isLoading } = useAllContacts();
  const updateContactStatus = useUpdateContactStatus();
  const deleteContact = useDeleteContact();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, loading, navigate]);

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

    try {
      await deleteContact.mutateAsync(id);
      toast.success("Message supprimé avec succès");
    } catch (error: any) {
      toast.error(error.message || "Échec de la suppression du message");
    }
  };

  const handleContactStatusChange = async (id: string, status: string) => {
    try {
      await updateContactStatus.mutateAsync({ id, status });
      toast.success("Statut mis à jour");
    } catch (error: any) {
      toast.error(error.message || "Échec de la mise à jour du statut");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Messages</h1>
        <p className="text-black mt-1">
          Gérez les messages reçus via le formulaire de contact
        </p>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Tous les messages ({contacts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-primary">Chargement...</div>
          ) : contacts && contacts.length > 0 ? (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-medium text-primary">
                      {contact.full_name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-semibold text-primary">{contact.full_name}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </span>
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {contact.service && (
                      <p className="text-sm text-muted-foreground">
                        Service : {contact.service}
                      </p>
                    )}
                    {contact.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {contact.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={contact.status}
                      onChange={(e) => handleContactStatusChange(contact.id, e.target.value)}
                      className={`text-xs px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusColors[contact.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      <option value="new">Nouveau</option>
                      <option value="contacted">Contacté</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>

                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun message pour le moment.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
