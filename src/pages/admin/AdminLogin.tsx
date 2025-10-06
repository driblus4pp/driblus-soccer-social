import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import PWAInstallBalloon from "@/components/PWAInstallBalloon";
import OnboardingScreen from "@/components/OnboardingScreen";
const AdminLogin = () => {
  const navigate = useNavigate();
  const {
    login,
    isLoading
  } = useAuth();
  const {
    canInstall,
    showPrompt,
    installApp,
    dismissPrompt
  } = usePWAInstall();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleStartDemo = () => {
    setShowOnboarding(true);
  };
  
  const handleOnboardingNext = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowOnboarding(false);
      setCurrentStep(1);
    }
  };
  
  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setCurrentStep(1);
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AdminLogin - Attempting login with:', formData.email);
    const success = await login(formData.email, formData.password);
    console.log('AdminLogin - Login result:', success);
    if (success) {
      console.log('AdminLogin - Login successful, navigating to dashboard');
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        navigate('/admin/dashboard', {
          replace: true
        });
      }, 100);
    } else {
      console.log('AdminLogin - Login failed');
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#1a3c5c] via-[#0f2a3f] to-[#0a1f2e] flex flex-col">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white hover:bg-white/20 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo/Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-2 text-orange-700">Driblus</h1>
          <p className="text-xl mb-4 text-orange-700">Admin</p>
          <div className="w-16 h-1 bg-[#F35410] mx-auto rounded"></div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input placeholder="Digite seu email de administrador" type="email" value={formData.email} onChange={e => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))} className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/60 rounded-lg text-base focus:border-[#F35410] focus:ring-[#F35410]" required />
              </div>
              <div>
                <Input placeholder="Digite sua senha" type="password" value={formData.password} onChange={e => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))} className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/60 rounded-lg text-base focus:border-[#F35410] focus:ring-[#F35410]" required />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-[#F35410] hover:bg-[#BA2D0B] text-white rounded-full font-medium text-base">
              {isLoading ? 'entrando...' : 'acessar painel admin'}
            </Button>
          </form>

          {/* Links */}
          <div className="text-center pt-8">
            <p className="text-white/70 text-sm">
              <Link to="/admin/esqueci-senha" className="text-[#F35410] hover:underline font-medium">
                Esqueci minha senha
              </Link>
            </p>
          </div>

          {/* Debug Info */}
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200 text-xs text-center">
              💡 Use: admin@driblus.com para testar
            </p>
          </div>

          {/* Demo Button */}
          <div className="text-center pt-4">
            <Button
              onClick={handleStartDemo}
              variant="outline"
              className="w-48 mx-auto bg-transparent border-[#F35410] text-[#F35410] hover:bg-[#F35410] hover:text-white text-sm rounded-full transition-colors"
            >
              Ver Como Funciona
            </Button>
          </div>
        </div>
      </div>

      {/* PWA Install Balloon */}
      {canInstall && <PWAInstallBalloon show={showPrompt} onInstall={installApp} onDismiss={dismissPrompt} />}
      
      {/* Onboarding Screen */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#1a3c5c] via-[#0f2a3f] to-[#0a1f2e] z-50">
          <OnboardingScreen
            step={currentStep}
            onNext={handleOnboardingNext}
            onSkip={handleOnboardingSkip}
            returnTo="/admin/login"
          />
        </div>
      )}
    </div>;
};
export default AdminLogin;