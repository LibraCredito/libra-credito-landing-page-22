import { Suspense, lazy, type ReactNode } from 'react';
// Lazy load React Query on the server bundle as well
const ReactQueryProvider = lazy(async () => {
  const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query');
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
      },
    },
  });
  return {
    default: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
});
import { StaticRouter } from "react-router-dom/server";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from '@/components/ScrollToTop';
import { MobileProvider } from '@/hooks/useMobileContext';
import { Toaster } from '@/components/ui/toast';
import { Analytics } from '@vercel/analytics/react';

const TooltipProvider = lazy(() => import('@/components/ui/tooltip').then(m => ({ default: m.TooltipProvider })));

// Import homepage directly (not lazy) for faster LCP
import Index from "./pages/Index";

// Lazy load other components
const Vantagens = lazy(() => import("./pages/Vantagens"));
const QuemSomos = lazy(() => import("./pages/QuemSomos"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Parceiros = lazy(() => import("./pages/Parceiros"));
const Simulacao = lazy(() => import("./pages/Simulacao"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const PoliticaCookies = lazy(() => import("./pages/PoliticaCookies"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const SupabaseTestPage = lazy(() => import("../temp-files/test-pages/SupabaseTestPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MobileDemo = lazy(() => import("../temp-files/test-pages/MobileDemo"));
const SimulacaoWizard = lazy(() => import("./pages/SimulacaoWizard"));
const SimpleWizardTest = lazy(() => import("../temp-files/test-pages/SimpleWizardTest"));
const MobileNavDemo = lazy(() => import("../temp-files/test-pages/MobileNavDemo"));
const SimulacaoSapi = lazy(() => import("./pages/SimulacaoSapi"));
const SimulacaoLocal = lazy(() => import("./pages/SimulacaoLocal"));
const Home2 = lazy(() => import("../temp-files/experimental-pages/Home2"));
const TestWebhook = lazy(() => import("../temp-files/test-pages/TestWebhook"));
const Confirmacao = lazy(() => import("./pages/Confirmacao"));
const Sucesso = lazy(() => import("./pages/Sucesso"));
const Atendimento = lazy(() => import("./pages/Atendimento"));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-libra-blue mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Carregando página...</p>
    </div>
  </div>
);

const AppServer = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ReactQueryProvider>
        <MobileProvider>
          <StaticRouter location="/">
            <ScrollToTop />
            <Suspense fallback={<Loading />}>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vantagens" element={
                <Suspense fallback={<Loading />}>
                  <TooltipProvider><Vantagens /></TooltipProvider>
                </Suspense>
              } />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/parceiros" element={<Parceiros />} />
              <Route path="/simulacao" element={
                <Suspense fallback={<Loading />}>
                  <TooltipProvider><Simulacao /></TooltipProvider>
                </Suspense>
              } />
              <Route path="/simulacao/sapi" element={<SimulacaoSapi />} />
              <Route path="/simulacao/local" element={<SimulacaoLocal />} />
              <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/politica-cookies" element={<PoliticaCookies />} />
              <Route path="/admin" element={
                <Suspense fallback={<Loading />}>
                  <TooltipProvider><AdminDashboard /></TooltipProvider>
                </Suspense>
              } />
              <Route path="/test-supabase" element={<SupabaseTestPage />} />
              <Route path="/test-webhook" element={<TestWebhook />} />
              <Route path="/mobile-demo" element={<MobileDemo />} />
              <Route path="/mobile-nav" element={<MobileNavDemo />} />
              <Route path="/simulacao-wizard" element={<SimulacaoWizard />} />
              <Route path="/wizard-test" element={<SimpleWizardTest />} />
              <Route path="/confirmacao" element={<Confirmacao />} />
              <Route path="/atendimento" element={<Atendimento />} />
              <Route path="/sucesso" element={<Sucesso />} />
              <Route path="/home2" element={<Home2 />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </StaticRouter>
          <Toaster />
          <Analytics />
        </MobileProvider>
      </ReactQueryProvider>
    </Suspense>
  );
};

export default AppServer;
