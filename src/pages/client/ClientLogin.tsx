import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import PWAInstallBalloon from "@/components/PWAInstallBalloon";
import OnboardingScreen from "@/components/OnboardingScreen";
const ClientLogin = () => {
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
  const [forceShowBalloon, setForceShowBalloon] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/cliente/dashboard');
    }
  };
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
  console.log('ClientLogin: PWA Estado =', {
    canInstall,
    showPrompt,
    forceShowBalloon
  });
  return <div className="min-h-screen bg-gradient-to-br from-[#1a3c5c] via-[#0f2a3f] to-[#0a1f2e] flex flex-col">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        
      </div>

      {/* Test Button - Temporary */}
      <div className="absolute top-6 right-6 z-10">
        
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo/Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-2 text-orange-700">Driblus</h1>
          <div className="w-16 h-1 bg-[#F35410] mx-auto rounded"></div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input placeholder="Digite seu email" type="email" value={formData.email} onChange={e => setFormData(prev => ({
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

            <Button type="submit" disabled={isLoading} className="w-full h-12 text-white rounded-full font-medium text-base bg-orange-700 hover:bg-orange-600">
              {isLoading ? 'entrando...' : 'entrar'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-8">
            <p className="text-white/70 text-sm">
              Não tem conta?{' '}
              <Link to="/cliente/cadastro" className="text-[#F35410] hover:underline font-medium">
                Cadastre-se aqui
              </Link>
            </p>
          </div>

          {/* Demo Button */}
          <div className="text-center pt-4">
            <Button onClick={handleStartDemo} variant="outline" className="w-48 mx-auto bg-transparent border-[#F35410] text-[#F35410] hover:bg-[#F35410] hover:text-white text-sm rounded-full transition-colors">
              Ver Como Funciona
            </Button>
          </div>
        </div>
      </div>

      {/* PWA Install Balloon */}
      <PWAInstallBalloon show={showPrompt || forceShowBalloon} onInstall={installApp} onDismiss={dismissPrompt} />
      
      {/* Onboarding Screen */}
      {showOnboarding && <div className="fixed inset-0 bg-gradient-to-br from-[#1a3c5c] via-[#0f2a3f] to-[#0a1f2e] z-50">
          <OnboardingScreen step={currentStep} onNext={handleOnboardingNext} onSkip={handleOnboardingSkip} returnTo="/cliente/login" />
        </div>}
    </div>;
};
export default ClientLogin;