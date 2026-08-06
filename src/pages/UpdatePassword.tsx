import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { toast } from "sonner";
import { z } from "zod";

const passwordSchema = z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères");

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  
  const { updatePassword } = useAuth();
  const navigate = useLocalizedNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    setError(undefined);

    try {
      const { error: updateError } = await updatePassword(password);
      if (updateError) {
        toast.error(updateError.message);
      } else {
        toast.success("Mot de passe mis à jour avec succès !");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-[#f4f4f7] rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-primary text-center mb-2">Nouveau Mot de Passe</h2>
          <p className="text-muted-foreground text-center mb-8">
            Veuillez saisir votre nouveau mot de passe ci-dessous.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(undefined);
                }}
                placeholder="••••••••"
                className="mt-2 bg-transparent"
              />
              {error && <p className="text-destructive text-sm mt-1">{error}</p>}
            </div>

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mise à jour..." : "Enregistrer le mot de passe"}
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdatePassword;
