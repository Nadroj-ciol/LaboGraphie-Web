import heroPlumber from "@/assets/hero-plumber.jpg";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useCareerBySlug, useCareers } from "@/hooks/useCareers";
import { useCreateJobApplication } from "@/hooks/useJobApplications";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowUpRight, Briefcase, Building2, CheckCircle2, FileText, Link as LinkIcon, Linkedin, Loader2, Mail, MapPin, MessageSquare, Phone, UploadCloud, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useTranslation } from "react-i18next";
import { z } from "zod";

// Doit rester cohérent avec le bucket 'job_cvs' (supabase/migrations/20260806000002_storage_job_cvs.sql)
const CV_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo
const CV_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".rtf", ".txt"];

const Career = () => {
  const { t } = useTranslation();
  const { slug } = useParams();

  // Validation schemas (dépendent de t, donc définis dans le composant)
  const nameSchema = z.string().trim().min(1, t("career.form.nameRequired")).max(100);
  const emailSchema = z.string().trim().email(t("career.form.emailInvalid")).max(255);
  const phoneSchema = z.string().trim().min(1, t("career.form.phoneRequired")).max(20);
  const { data: careers, isLoading: careersLoading } = useCareers();
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id);

  const { data: currentCareer, isLoading: careerLoading } = useCareerBySlug(slug);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [uploadingCv, setUploadingCv] = useState(false);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createApplication = useCreateJobApplication();

  // Auto-fill form when user is logged in
  useEffect(() => {
    if (user) {
      // Set email from user auth
      if (user.email && !email) {
        setEmail(user.email);
      }

      // Set full name from profile or user metadata
      if (!fullName) {
        const name = profile?.full_name || user.user_metadata?.full_name || "";
        setFullName(name);
      }

      // Set phone from profile or user metadata
      if (!phone) {
        const userPhone = profile?.phone || user.user_metadata?.phone || "";
        setPhone(userPhone);
      }
    }
  }, [user, profile, email, fullName, phone]);

  // Get first career as default if no slug or career not found
  const job = currentCareer || (careers && careers.length > 0 ? careers[0] : null);

  // Get other job openings (excluding current)
  const otherJobs = careers?.filter((j) => j.slug !== job?.slug).slice(0, 3) || [];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameResult = nameSchema.safeParse(fullName);
    if (!nameResult.success) {
      newErrors.fullName = nameResult.error.errors[0].message;
    }

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success) {
      newErrors.phone = phoneResult.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;

    if (file.size > CV_MAX_SIZE_BYTES) {
      setErrors(prev => ({ ...prev, cvFile: t("career.form.cvTooLarge") }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!CV_ALLOWED_EXTENSIONS.includes(ext)) {
      setErrors(prev => ({ ...prev, cvFile: t("career.form.cvUnsupportedFormat") }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.cvFile;
      return newErrors;
    });

    setUploadingCv(true);
    try {
      const path = `${Date.now()}-${crypto.randomUUID()}${ext}`;
      const { error } = await supabase.storage.from("job_cvs").upload(path, file);
      if (error) throw error;

      // Préfixe reconnu par DashboardApplications pour générer une URL
      // signée à la demande (le bucket 'job_cvs' n'est pas public).
      setCvLink(`storage://job_cvs/${path}`);
      setCvFileName(file.name);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        cvFile: t("career.form.cvUploadFailed", { error: error instanceof Error ? error.message : String(error) }),
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setUploadingCv(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !job) return;

    await createApplication.mutateAsync({
      career_id: job.id,
      job_title: job.title,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      current_company: currentCompany.trim() || null,
      linkedin_url: linkedin.trim() || null,
      cv_link: cvLink.trim() || null,
      note: note.trim() || null,
    });

    // Reset form on success
    setFullName("");
    setEmail("");
    setCurrentCompany("");
    setPhone("");
    setLinkedin("");
    setCvLink("");
    setCvFileName("");
    setNote("");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (careersLoading || careerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom mx-auto section-padding py-32 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t("career.noOpeningTitle")}</h1>
          <p className="text-muted-foreground mb-8">
            {t("career.noOpeningDescription")}
          </p>
          <Link to="/">
            <Button>{t("career.backHome")}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container-custom mx-auto section-padding text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">
                {t("common.nav.home")}
              </Link>
              <span>/</span>
              <span className="text-primary">{t("career.breadcrumbLabel")}</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Job Title Section */}
      <section className="pb-12 px-4">
        <div className="container-custom mx-auto section-padding text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {job.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              {t("career.intro")}
            </p>
            <a
              href="#openings"
              className="inline-flex items-center gap-2 text-secondary font-bold hover:underline"
            >
              {t("career.seeAllPositions")}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 px-4">
        <div className="container-custom mx-auto section-padding">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Column - Image & Content */}
            <div className="lg:col-span-8">
              <FadeIn>
                {/* Hero Image */}
                <div className="rounded-2xl overflow-hidden mb-12">
                  <img
                    src={heroPlumber}
                    alt={job.title}
                    className="w-full h-[300px] md:h-[400px] object-cover"
                  />
                </div>

                {/* About the Role */}
                <div className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {t("career.aboutRole")}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {job.about_the_role.map((text, index) => (
                      <p key={index}>{text}</p>
                    ))}
                  </div>
                </div>

                {/* In the short term, you will */}
                <div className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {t("career.shortTermGoals")}
                  </h2>
                  <ul className="space-y-3">
                    {job.short_term_goals.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What you bring to the table */}
                <div className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {t("career.whatYouBring")}
                  </h2>
                  <ul className="space-y-3">
                    {job.what_you_bring.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Why you might love working here */}
                <div className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {t("career.whyYouLove")}
                  </h2>
                  <ul className="space-y-3">
                    {job.why_you_might_love.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-1 text-secondary fill-primary stroke-white flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>

            {/* Form */}
            <div className="bg-background border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit rounded-2xl p-8 sticky top-32 lg:col-span-4 transition-all duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                {t("career.form.title")}
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1">
                    {t("career.form.fullName")} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      className="bg-muted/50 border-border h-11 pl-10 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary transition-all rounded-xl"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t("career.form.fullNamePlaceholder")}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-destructive text-xs mt-1 font-medium">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1">
                    {t("career.form.email")} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="email"
                      className="bg-muted/50 border-border h-11 pl-10 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary transition-all rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("career.form.emailPlaceholder")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1 font-medium">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {t("career.form.currentCompany")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      className="bg-muted/50 border-border h-11 pl-10 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary transition-all rounded-xl"
                      value={currentCompany}
                      onChange={(e) => setCurrentCompany(e.target.value)}
                      placeholder={t("career.form.currentCompanyPlaceholder")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1">
                    {t("career.form.phone")} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="tel"
                      placeholder={t("career.form.phonePlaceholder")}
                      className="bg-muted/50 border-border h-11 pl-10 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary transition-all rounded-xl"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-destructive text-xs mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {t("career.form.linkedin")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Linkedin className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      className="bg-muted/50 border-border h-11 pl-10 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary transition-all rounded-xl"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder={t("career.form.linkedinPlaceholder")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 pb-1 border-t border-border">
                  <label className="text-sm font-medium text-foreground flex items-center justify-between">
                    <span>{t("career.form.cv")} <span className="text-muted-foreground font-normal text-xs">{t("career.form.cvMax")}</span></span>
                  </label>

                  {cvFileName ? (
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl p-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm text-primary font-medium truncate">{cvFileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCvFileName("");
                          setCvLink("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-xs text-destructive hover:underline px-2"
                      >
                        {t("career.form.cvRemove")}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      <div className="relative group">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.rtf,.txt"
                          onChange={handleFileUpload}
                          ref={fileInputRef}
                          disabled={uploadingCv}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-wait"
                        />
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 bg-muted/50 group-hover:bg-muted transition-all text-center">
                          {uploadingCv ? (
                            <>
                              <Loader2 className="h-6 w-6 text-primary mb-2 animate-spin" />
                              <span className="text-xs font-medium text-muted-foreground">
                                {t("career.form.cvUploading")}
                              </span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="h-6 w-6 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {t("career.form.cvDropzone")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="relative flex items-center justify-center py-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border"></div>
                        </div>
                        <span className="relative bg-background px-2 text-xs text-muted-foreground uppercase">{t("career.form.or")}</span>
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                          className="bg-muted/50 border-border h-10 pl-10 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary transition-all rounded-xl text-sm"
                          value={cvLink}
                          onChange={(e) => setCvLink(e.target.value)}
                          placeholder={t("career.form.cvLinkPlaceholder")}
                        />
                      </div>
                    </div>
                  )}
                  {errors.cvFile && (
                    <p className="text-destructive text-xs mt-1 font-medium">{errors.cvFile}</p>
                  )}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border">
                  <label className="text-sm font-medium text-foreground">
                    {t("career.form.note")}
                  </label>
                  <div className="relative group">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MessageSquare className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Textarea
                      placeholder={t("career.form.notePlaceholder")}
                      className="bg-muted/50 border-border min-h-[100px] pl-10 pt-3 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary transition-all rounded-xl resize-none"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 transition-all duration-300 mt-2"
                  disabled={createApplication.isPending || uploadingCv}
                >
                  {createApplication.isPending ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("career.form.sending")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center font-bold">
                      {t("career.form.submit")}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Other Opportunities Section */}
      {otherJobs.length > 0 && (
        <section id="openings" className="py-16 px-4 bg-muted">
          <div className="container-custom mx-auto section-padding">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                {t("career.otherOpenings")}
              </h2>


              <div className="space-y-4">
                {otherJobs.map((otherJob, index) => (

                  <FadeIn key={index} delay={index * 100}>
                    <Link
                      key={otherJob.slug}
                      to={`/career/${otherJob.slug}`}
                      className={`${otherJob.slug === slug ? "bg-accent" : "bg-card"
                        } cursor-pointer rounded-xl px-6 py-5 flex items-center justify-between hover:bg-accent transition-all group duration-300`}
                    >
                      <div className="flex items-center gap-8 flex-wrap">
                        <h5 className="text-primary font-bold min-w-[200px]">
                          {otherJob.title}
                        </h5>
                        <div className="flex items-center gap-6">
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            {otherJob.type}
                          </span>
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {otherJob.location}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-6 h-6 text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Career;
