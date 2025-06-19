
import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { User, Building, Shield, ArrowRight } from "lucide-react";
import OnboardingScreen from "@/components/OnboardingScreen";
import AdvancedAuthScreen from "@/components/AdvancedAuthScreen";
import MainApp from "@/components/MainApp";
import OwnerDashboard from "@/components/OwnerDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'onboarding' | 'auth'>('home');
  const [onboardingStep, setOnboardingStep] = useState(1);

  // If user is logged in, show appropriate dashboard based on role
  if (user) {
    switch (user.role) {
      case UserRole.ADMIN:
        return <AdminDashboard />;
      case UserRole.COURT_MANAGER:
        return <OwnerDashboard />;
      case UserRole.USER:
      default:
        return <MainApp />;
    }
  }

  if (currentScreen === 'auth') {
    return <AdvancedAuthScreen onComplete={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] text-white overflow-hidden">
        <OnboardingScreen 
          step={onboardingStep}
          onNext={() => {
            if (onboardingStep < 2) {
              setOnboardingStep(onboardingStep + 1);
            } else {
              setCurrentScreen('home');
            }
          }}
          onSkip={() => setCurrentScreen('home')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      <div className="p-4 space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" alt="Driblus Logo" className="h-16 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Driblus</h1>
          <p className="text-white/70 text-lg">Sistema SaaS de Agendamento Esportivo</p>
          <p className="text-white/60 text-sm mt-2">Conecte-se ao seu esporte favorito</p>
        </div>

        {/* User Type Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Como você quer acessar?</h2>
          
          {/* Client Access */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                onClick={() => navigate('/cliente/login')}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-[#F35410] rounded-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span>Sou Cliente</span>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </div>
              </CardTitle>
              <CardDescription className="text-white/70">
                Quero buscar e agendar quadras esportivas
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Manager Access */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                onClick={() => navigate('/gestor/login')}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-[#F35410] rounded-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span>Sou Gestor de Quadra</span>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </div>
              </CardTitle>
              <CardDescription className="text-white/70">
                Quero disponibilizar minha quadra na plataforma
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Admin Access */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                onClick={() => navigate('/admin/login')}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-[#F35410] rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span>Sou Administrador</span>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </div>
              </CardTitle>
              <CardDescription className="text-white/70">
                Acesso ao painel administrativo da Driblus
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Features Preview */}
        <div className="mt-8">
          <Button
            onClick={() => setCurrentScreen('onboarding')}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            Ver Como Funciona
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60 text-sm">
          <p>© 2024 Driblus - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
