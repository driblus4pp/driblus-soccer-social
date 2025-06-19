
import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from '@/types';
import OnboardingScreen from "@/components/OnboardingScreen";
import AdvancedAuthScreen from "@/components/AdvancedAuthScreen";
import MainApp from "@/components/MainApp";
import OwnerDashboard from "@/components/OwnerDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'auth' | 'app'>('onboarding');
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
    return <AdvancedAuthScreen onComplete={() => setCurrentScreen('app')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] text-white overflow-hidden">
      <OnboardingScreen 
        step={onboardingStep}
        onNext={() => {
          if (onboardingStep < 2) {
            setOnboardingStep(onboardingStep + 1);
          } else {
            setCurrentScreen('auth');
          }
        }}
        onSkip={() => setCurrentScreen('auth')}
      />
    </div>
  );
};

export default Index;
