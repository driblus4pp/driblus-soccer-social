
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Client Routes
import ClientLogin from "./pages/client/ClientLogin";
import ClientRegister from "./pages/client/ClientRegister";
import ClientDashboard from "./pages/client/ClientDashboard";
import CourtDetailsPage from "./pages/client/CourtDetailsPage";
import BookingPage from "./pages/client/BookingPage";
import BookingConfirmationPage from "./pages/client/BookingConfirmationPage";
import AthleteProfile from "./pages/client/AthleteProfile";

// Manager Routes
import ManagerLogin from "./pages/manager/ManagerLogin";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ConfigureCourt from "./pages/manager/ConfigureCourt";
import ManagerBookings from "./pages/manager/ManagerBookings";

// Admin Routes
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourts from "./pages/admin/AdminCourts";
import AdminCourtDetails from "./pages/admin/AdminCourtDetails";
import AdminManagers from "./pages/admin/AdminManagers";
import AdminBookings from "./pages/admin/AdminBookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Client Routes */}
            <Route path="/cliente/login" element={<ClientLogin />} />
            <Route path="/cliente/cadastro" element={<ClientRegister />} />
            <Route path="/cliente/dashboard" element={<ClientDashboard />} />
            <Route path="/cliente/quadra/:id" element={<CourtDetailsPage />} />
            <Route path="/cliente/quadra/:id/agendar" element={<BookingPage />} />
            <Route path="/cliente/confirmacao" element={<BookingConfirmationPage />} />
            
            {/* Manager Routes */}
            <Route path="/gestor/login" element={<ManagerLogin />} />
            <Route path="/gestor/dashboard" element={<ManagerDashboard />} />
            <Route path="/gestor/quadra/configurar" element={<ConfigureCourt />} />
            <Route path="/gestor/agendamentos" element={<ManagerBookings />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/quadras" element={<AdminCourts />} />
            <Route path="/admin/quadras/:id" element={<AdminCourtDetails />} />
            <Route path="/admin/gestores" element={<AdminManagers />} />
            <Route path="/admin/agendamentos" element={<AdminBookings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
