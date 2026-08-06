import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Calendar, Shield, User, Save, Loader2 } from "lucide-react";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardProfile() {
  const { user, isAdmin } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id);
  const queryClient = useQueryClient();

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || user?.user_metadata?.full_name || "");
      setPhone(profile.phone || user?.user_metadata?.phone || "");
      setAvatarUrl(profile.avatar_url || user?.user_metadata?.avatar_url || null);
    } else if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setPhone(user.user_metadata?.phone || "");
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [profile, user]);

  if (!user) return null;

  const userNameDisplay = fullName || user.email?.split("@")[0] || "User";
  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString() : "Non renseigné";

  const handleAvatarUpload = async (url: string) => {
    setAvatarUrl(url);

    // Auto save avatar in DB
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update auth meta data too for sync
      await supabase.auth.updateUser({
        data: { avatar_url: url }
      });

      queryClient.invalidateQueries({ queryKey: ["userProfile", user.id] });

      toast.success("Photo de profil mise à jour avec succès.");
    } catch (error) {
      toast.error("Impossible d'enregistrer l'image : " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update metadata
      await supabase.auth.updateUser({
        data: { full_name: fullName, phone: phone }
      });

      queryClient.invalidateQueries({ queryKey: ["userProfile", user.id] });

      toast.success("Vos informations ont été enregistrées avec succès.");
    } catch (error) {
      toast.error("Erreur de sauvegarde : " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-primary">Profil</h1>
        <p className="text-black mt-1">
          Gérez vos informations personnelles et votre photo
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="bg-white border border-gray-200 md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">

              <AvatarUpload
                userId={user.id}
                url={avatarUrl}
                userName={userNameDisplay}
                onUpload={handleAvatarUpload}
              />

              <h3 className="text-xl font-semibold">{userNameDisplay}</h3>
              <p className="text-sm text-muted-primary">{user.email}</p>

              {isAdmin && (
                <div className="mt-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Administrateur
                  </span>
                </div>
              )}

            </div>
          </CardContent>
        </Card>

        {/* Account Details Form */}
        <Card className="bg-white border border-gray-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Détails du compte
            </CardTitle>
            <CardDescription>Mettez à jour vos informations publiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nadroj ciol"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6XX XX XX XX"
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-muted-foreground">Adresse e-mail (Non modifiable)</Label>
                <Input value={user.email || ""} disabled className="bg-gray-50" />
              </div>

              <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Membre depuis le {createdAt}</span>
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button onClick={handleSaveProfile} disabled={isSaving || profileLoading}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
