import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import OfflineIndicator from "./components/OfflineIndicator";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import LanguageLayout from "./components/LanguageLayout";
import RootRedirect from "./components/RootRedirect";
import Index from "./pages/Index";

// Pages publiques secondaires chargées à la demande (code-splitting)
const About = lazy(() => import("./pages/About"));
const Auth = lazy(() => import("./pages/Auth"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Career = lazy(() => import("./pages/Career"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const QuoteCalculator = lazy(() => import("./pages/QuoteCalculator"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Services = lazy(() => import("./pages/Services"));
const Work = lazy(() => import("./pages/Work"));
const WorkDetail = lazy(() => import("./pages/WorkDetail"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));

// Dashboard chargé uniquement pour les utilisateurs accédant à /dashboard
const DashboardLayout = lazy(() =>
  import("./components/dashboard/DashboardLayout").then((m) => ({ default: m.DashboardLayout })),
);
const DashboardApplications = lazy(() => import("./pages/dashboard/DashboardApplications"));
const DashboardBlogs = lazy(() => import("./pages/dashboard/DashboardBlogs"));
const DashboardCareers = lazy(() => import("./pages/dashboard/DashboardCareers"));
const DashboardContacts = lazy(() => import("./pages/dashboard/DashboardContacts"));
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const DashboardProfile = lazy(() => import("./pages/dashboard/DashboardProfile"));
const DashboardQuotes = lazy(() => import("./pages/dashboard/DashboardQuotes"));
const DashboardServiceInquiries = lazy(() => import("./pages/dashboard/DashboardServiceInquiries"));
const DashboardPricing = lazy(() => import("./pages/dashboard/DashboardPricing"));
const UserQuotes = lazy(() => import("./pages/dashboard/UserQuotes"));
const UserServiceInquiries = lazy(() => import("./pages/dashboard/UserServiceInquiries"));

const PageFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
  </div>
);

// Create QueryClient outside component to prevent recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes  
      refetchOnWindowFocus: false, // Prevent refetch when switching browser tabs
      refetchOnMount: false, // Don't refetch on mount if data exists
      refetchOnReconnect: false, // Don't refetch on network reconnect
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="labographie-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <OfflineIndicator />
          <FloatingWhatsApp />
          <BrowserRouter>
            <div className="overflow-x-hidden w-full relative flex flex-col min-h-screen">
              <ScrollToTop />
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  {/* "/" ne rend jamais de contenu : redirection immédiate vers la langue détectée */}
                  <Route path="/" element={<RootRedirect />} />

                  {/* Pages publiques, préfixées par la langue */}
                  <Route path="/:lang" element={<LanguageLayout />}>
                    <Route index element={<Index />} />
                    <Route path="about" element={<About />} />
                    <Route path="career" element={<Career />} />
                    <Route path="career/:slug" element={<Career />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/:slug" element={<ServiceDetail />} />
                    <Route path="work" element={<Work />} />
                    <Route path="work/:slug" element={<WorkDetail />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogDetail />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="quote" element={<QuoteCalculator />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="update-password" element={<UpdatePassword />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Dashboard : hors i18n, reste en français, jamais préfixé par la langue */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="contacts" element={<DashboardContacts />} />
                    <Route path="quotes" element={<DashboardQuotes />} />
                    <Route path="service-inquiries" element={<DashboardServiceInquiries />} />
                    <Route path="pricing" element={<DashboardPricing />} />
                    <Route path="blogs" element={<DashboardBlogs />} />
                    <Route path="careers" element={<DashboardCareers />} />
                    <Route path="applications" element={<DashboardApplications />} />
                    <Route path="profile" element={<DashboardProfile />} />
                    <Route path="my-quotes" element={<UserQuotes />} />
                    <Route path="my-inquiries" element={<UserServiceInquiries />} />
                  </Route>

                  {/* Toute autre URL hors "/:lang" (ex. ancien lien sans préfixe) */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
