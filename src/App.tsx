import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from '@/components/ScrollToTop';
import { MobileProvider } from '@/hooks/useMobileContext';

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
const SupabaseTestPage = lazy(() => import("./pages/SupabaseTestPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MobileDemo = lazy(() => import("./pages/MobileDemo"));
const SimulacaoWizard = lazy(() => import("./pages/SimulacaoWizard"));
const SimpleWizardTest = lazy(() => import("./pages/SimpleWizardTest"));
const MobileNavDemo = lazy(() => import("./pages/MobileNavDemo"));
const SimulacaoSapi = lazy(() => import("./pages/SimulacaoSapi"));
const SimulacaoLocal = lazy(() => import("./pages/SimulacaoLocal"));
const Home2 = lazy(() => import("./pages/Home2"));
const TestWebhook = lazy(() => import("./pages/TestWebhook"));
const Confirmacao = lazy(() => import("./pages/Confirmacao"));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-libra-blue mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Carregando página...</p>
    </div>
  </div>
);

// Configure query client outside component to prevent re-initialization
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MobileProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/vantagens" element={<Vantagens />} />
                  <Route path="/quem-somos" element={<QuemSomos />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/parceiros" element={<Parceiros />} />
                  <Route path="/simulacao" element={<Simulacao />} />
                  <Route path="/simulacao/sapi" element={<SimulacaoSapi />} />
                  <Route path="/simulacao/local" element={<SimulacaoLocal />} />
                  <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
                  <Route path="/politica-cookies" element={<PoliticaCookies />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/test-supabase" element={<SupabaseTestPage />} />
                  <Route path="/test-webhook" element={<TestWebhook />} />
                  <Route path="/mobile-demo" element={<MobileDemo />} />
                  <Route path="/mobile-nav" element={<MobileNavDemo />} />
                  <Route path="/simulacao-wizard" element={<SimulacaoWizard />} />
                  <Route path="/wizard-test" element={<SimpleWizardTest />} />
                  <Route path="/confirmacao" element={<Confirmacao />} />
                  <Route path="/home2" element={<Home2 />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
        </MobileProvider>
      </QueryClientProvider>
  );
};

export default App;
