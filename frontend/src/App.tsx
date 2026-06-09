import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { CookieBanner } from "@/components/cookie-banner";
import LandingPage from "@/pages/landing";
import PartnerPage from "@/pages/partner";
import DrivePage from "@/pages/drive";
import LegalPage from "@/pages/legal";
import AboutPage from "@/pages/about";
import ServicesPage from "@/pages/services";
import GetTheAppPage from "@/pages/get-the-app";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/partner" component={PartnerPage} />
      <Route path="/drive" component={DrivePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/get-the-app" component={GetTheAppPage} />
      <Route path="/legal/:slug" component={LegalPage} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function FaviconUpdater() {
  const { faviconUrl } = useSiteConfig();

  useEffect(() => {
    if (!faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
    link.type = faviconUrl.startsWith("data:image/svg") ? "image/svg+xml" : "image/png";
  }, [faviconUrl]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <LanguageProvider>
            <FaviconUpdater />
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <CookieBanner />
          </LanguageProvider>
        </AdminAuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
