/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useAllContacts, useDeleteContact, useUpdateContactStatus } from "@/hooks/useContacts";
import { Calendar, Mail, Phone, Trash2 } from "lucide-react";
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
  new: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  contacted: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function DashboardContacts() {
  const { isAdmin, loading } = useAuth();
  const navigate = useLocalizedNavigate();
  const { data: contacts, isLoading } = useAllContacts();
  const updateContactStatus = useUpdateContactStatus();
  const deleteContact = useDeleteContact();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredContacts = (contacts || []).filter(
    (c) => statusFilter === "all" || c.status === statusFilter,
  );

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, loading, navigate]);

  const handleDeleteContact = async (id: string) => {

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
        <p className="text-foreground mt-1">
          Gérez les messages reçus via le formulaire de contact
        </p>
      </div>

      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Tous les messages ({filteredContacts.length})
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "Tous" },
              { value: "new", label: "Nouveau" },
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
          ) : filteredContacts.length > 0 ? (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-border bg-muted"
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
                      className={`text-xs px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusColors[contact.status] || "bg-muted text-muted-foreground"}`}
                    >
                      <option value="new">Nouveau</option>
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
                            Cette action est irréversible. Cela supprimera définitivement ce message.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-card text-muted-foreground">Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteContact(contact.id)} className="bg-destructive text-white hover:bg-destructive/90">
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
