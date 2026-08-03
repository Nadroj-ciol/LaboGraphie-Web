import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Veuillez saisir une adresse e-mail valide");
const passwordSchema = z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères");
const phoneSchema = z.string().min(6, "Veuillez saisir un numéro de téléphone valide").max(15, "Le numéro de téléphone est trop long");

const COUNTRY_CODES = [
  { code: "+237", country: "Cameroun (CM)" },
  { code: "+33", country: "France (FR)" },
  { code: "+225", country: "Côte d'Ivoire (CI)" },
  { code: "+221", country: "Sénégal (SN)" },
  { code: "+241", country: "Gabon (GA)" },
  { code: "+242", country: "Congo (CG)" },
  { code: "+243", country: "RDC (CD)" },
  { code: "+1", country: "USA/Canada" },
];

const Auth = () => {
  const [view, setView] = useState<"login" | "signup" | "forgot_password">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+237");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string }>({});

  const { user, isAdmin, signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if they navigate to /auth manually but are already logged in
    if (user && !isSubmitting) {
      navigate(isAdmin ? "/dashboard" : "/");
    }
  }, [user, isAdmin, navigate, isSubmitting]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; phone?: string } = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    if (view !== "forgot_password") {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
    }

    if (view === "signup") {
      const phoneResult = phoneSchema.safeParse(phone);
      if (!phoneResult.success) {
        newErrors.phone = phoneResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (view === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("E-mail ou mot de passe invalide");
          } else if (error.message.includes("Email not confirmed")) {
            toast.error("Veuillez confirmer votre adresse e-mail avant de vous connecter.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Connexion réussie !");
          // Redirection handled in useEffect or we can force it here:
          setTimeout(() => {
             navigate(isAdmin ? "/dashboard" : "/");
          }, 100);
        }
      } else if (view === "signup") {
        const fullPhone = `${countryCode} ${phone}`;
        const { error } = await signUp(email, password, fullName, fullPhone);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("Cet e-mail est déjà enregistré. Veuillez vous connecter.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.");
          setView("login");
        }
      } else if (view === "forgot_password") {
        const { error } = await resetPassword(email);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Instructions de réinitialisation envoyées à votre adresse e-mail.");
          setView("login");
        }
      }
    } catch (err) {
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="py-32 md:py-40">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-[#f4f4f7] rounded-3xl p-8 shadow-sm">
              <h2 className="text-primary text-center mb-2 font-bold text-2xl">
                {view === "login" && "Bon Retour"}
                {view === "signup" && "Créer un Compte"}
                {view === "forgot_password" && "Mot de passe oublié"}
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                {view === "login" && "Connectez-vous pour accéder à votre compte"}
                {view === "signup" && "Inscrivez-vous pour commencer l'aventure"}
                {view === "forgot_password" && "Saisissez votre e-mail pour réinitialiser"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {view === "signup" && (
                  <>
                    <div>
                      <Label htmlFor="fullName">Nom Complet</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jean Dupont"
                        className="mt-2 bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Numéro de Téléphone *</Label>
                      <div className="flex gap-2 mt-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-[120px] bg-white">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <span className="font-medium">{country.code}</span> <span className="text-muted-foreground text-xs">{country.country}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setErrors((prev) => ({ ...prev, phone: undefined }));
                          }}
                          placeholder="6XX XX XX XX"
                          className="bg-white flex-1"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="email">Adresse E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="vous@exemple.com"
                    className="mt-2 bg-white"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {view !== "forgot_password" && (
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mot de Passe</Label>
                      {view === "login" && (
                        <button
                          type="button"
                          onClick={() => {
                            setView("forgot_password");
                            setErrors({});
                          }}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Oublié ?
                        </button>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="••••••••"
                      className="mt-2 bg-white"
                    />
                    {errors.password && (
                      <p className="text-destructive text-sm mt-1">{errors.password}</p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-full h-11"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Veuillez patienter..."
                    : view === "login"
                      ? "Se Connecter"
                      : view === "signup"
                        ? "Créer un Compte"
                        : "Envoyer le lien"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2 flex flex-col">
                {view === "forgot_password" && (
                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setErrors({});
                    }}
                    className="text-slate-600 font-medium hover:text-primary transition-colors text-sm"
                  >
                    Retour à la connexion
                  </button>
                )}
                
                {view !== "forgot_password" && (
                  <button
                    type="button"
                    onClick={() => {
                      setView(view === "login" ? "signup" : "login");
                      setErrors({});
                    }}
                    className="text-slate-600 font-medium hover:text-primary transition-colors text-sm"
                  >
                    {view === "login"
                      ? "Vous n'avez pas de compte ? Inscrivez-vous"
                      : "Vous avez déjà un compte ? Connectez-vous"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Auth;
