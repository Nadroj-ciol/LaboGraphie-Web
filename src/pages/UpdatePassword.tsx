import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const UpdatePassword = () => {
  const { t } = useTranslation();
  const passwordSchema = z.string().min(6, t("auth.passwordTooShort"));

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const { session, loading, updatePassword } = useAuth();
  const navigate = useLocalizedNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("updatePassword.mismatch", "Les mots de passe ne correspondent pas."));
      return;
    }

    setIsSubmitting(true);
    setError(undefined);

    try {
      const { error: updateError } = await updatePassword(password);
      if (updateError) {
        toast.error(updateError.message);
      } else {
        toast.success(t("updatePassword.success"));
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(t("updatePassword.unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-muted rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-primary text-center mb-2">{t("updatePassword.title")}</h2>
          <p className="text-muted-foreground text-center mb-8">
            {t("updatePassword.description")}
          </p>

          {!loading && !session ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                {t("updatePassword.noSession", "Votre lien de réinitialisation est expiré ou invalide. Demandez un nouveau lien depuis la page de connexion.")}
              </p>
              <Button
                type="button"
                className="w-full rounded-full"
                onClick={() => navigate("/auth")}
              >
                {t("common.header.login")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="password">{t("updatePassword.label")}</Label>
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
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  {t("updatePassword.confirmLabel", "Confirmer le mot de passe")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
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
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? t("updatePassword.updating") : t("updatePassword.submit")}
              </Button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdatePassword;
