import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TraceProduce from "./pages/TraceProduce";
import Dashboard from "./pages/Dashboard";
import RegisterBatch from "./pages/RegisterBatch";
import Auth from "./pages/Auth";
import StakeholderRegistration from "./pages/StakeholderRegistration";
import Profile from "./pages/Profile";
import AgroNews from "./pages/AgroNews";
import SkillCenter from "./pages/SkillCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<StakeholderRegistration />} />
              <Route path="/trace" element={<TraceProduce />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/farmer/register-batch" element={<RegisterBatch />} />
              <Route path="/agro-news" element={<AgroNews />} />
              <Route path="/skill-center" element={<SkillCenter />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
