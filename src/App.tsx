
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Client Routes
import ClientLogin from "./pages/client/ClientLogin";
import ClientRegister from "./pages/client/ClientRegister";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientCourts from "./pages/client/ClientCourts";
import ClientSchedule from "./pages/client/ClientSchedule";
import ClientProfile from "./pages/client/ClientProfile";
import ClientAppSettings from "./pages/client/ClientAppSettings";
import ClientEditProfile from "./pages/client/ClientEditProfile";
import CourtDetailsPage from "./pages/client/CourtDetailsPage";
import BookingPage from "./pages/client/BookingPage";
import BookingConfirmationPage from "./pages/client/BookingConfirmationPage";
import BookingSuccessPage from "./pages/client/BookingSuccessPage";

// Manager Routes
import ManagerLogin from "./pages/manager/ManagerLogin";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ConfigureCourt from "./pages/manager/ConfigureCourt";
import ManagerReports from "./pages/manager/ManagerReports";
import ManagerProfile from "./pages/manager/ManagerProfile";
import ManagerEditProfile from "./pages/manager/ManagerEditProfile";
import ManagerCourtSettings from "./pages/manager/ManagerCourtSettings";
import ManagerPreferences from "./pages/manager/ManagerPreferences";
import ManagerFinancialReports from "./pages/manager/ManagerFinancialReports";
import ManagerNotifications from "./pages/manager/ManagerNotifications";

// Admin Routes
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourts from "./pages/admin/AdminCourts";
import AdminCourtDetails from "./pages/admin/AdminCourtDetails";
import AdminManagers from "./pages/admin/AdminManagers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";
import AdminCreateCourt from "./pages/admin/AdminCreateCourt";

// Auth Routes
import ForgotPassword from "./pages/client/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <>
      {isLoading && <LoadingScreen message={loadingMessage} />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Auth Routes - Unified */}
        <Route path="/auth/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        
        {/* Legacy Client Routes - kept for compatibility */}
        <Route path="/cliente/login" element={<ClientLogin />} />
        <Route path="/cliente/cadastro" element={<ClientRegister />} />
        <Route path="/cliente/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/cliente/dashboard" element={
          <ProtectedRoute requiredRole="cliente">
            <ClientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/cliente/quadras" element={<ClientCourts />} />
        <Route path="/cliente/agendamentos" element={<ClientSchedule />} />
        <Route path="/cliente/perfil" element={<ClientProfile />} />
        <Route path="/cliente/configuracoes" element={<ClientAppSettings />} />
        <Route path="/cliente/perfil/editar" element={<ClientEditProfile />} />
        <Route path="/cliente/quadra/:id" element={<CourtDetailsPage />} />
        <Route path="/cliente/quadra/:id/agendar" element={<BookingPage />} />
        <Route path="/cliente/quadra/:id/confirmacao" element={<BookingConfirmationPage />} />
        <Route path="/cliente/agendamento-sucesso" element={<BookingSuccessPage />} />
        
        {/* Manager Routes - Simplificadas */}
        <Route path="/gestor/login" element={<ManagerLogin />} />
        <Route path="/gestor/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/gestor/dashboard" element={<ManagerDashboard />} />
        <Route path="/gestor/notificacoes" element={<ManagerNotifications />} />
        <Route path="/gestor/perfil" element={<ManagerProfile />} />
        <Route path="/gestor/perfil/editar" element={<ManagerEditProfile />} />
        
        {/* Admin Routes - Simplificadas */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/quadras" element={<AdminCourts />} />
        <Route path="/admin/quadras/nova" element={<AdminCreateCourt />} />
        <Route path="/admin/quadras/:id" element={<AdminCourtDetails />} />
        <Route path="/admin/gestores" element={<AdminManagers />} />
        <Route path="/admin/relatorios" element={<AdminReports />} />
        <Route path="/admin/configuracoes" element={<AdminSettings />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LoadingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </LoadingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
