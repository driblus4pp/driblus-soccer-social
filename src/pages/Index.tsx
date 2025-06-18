
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, DollarSign } from "lucide-react";
import OnboardingScreen from "@/components/OnboardingScreen";
import AuthScreen from "@/components/AuthScreen";
import MainApp from "@/components/MainApp";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'auth' | 'app'>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(1);

  if (currentScreen === 'auth') {
    return <AuthScreen onComplete={() => setCurrentScreen('app')} />;
  }

  if (currentScreen === 'app') {
    return <MainApp />;
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
