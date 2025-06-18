
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, DollarSign, Trophy, Star, Clock } from "lucide-react";

interface OnboardingScreenProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingScreen = ({ step, onNext, onSkip }: OnboardingScreenProps) => {
  const screens = [
    {
      title: "O que é o Driblus?",
      subtitle: "Sua plataforma completa para futebol amador",
      features: [
        { icon: MapPin, text: "Encontre quadras perto de você", color: "text-green-400" },
        { icon: Users, text: "Monte seus rachões com os amigos", color: "text-blue-400" },
        { icon: DollarSign, text: "Divida os custos do jogo com facilidade", color: "text-yellow-400" }
      ],
      image: "⚽"
    },
    {
      title: "Por que usar o Driblus?",
      subtitle: "Benefícios que fazem a diferença",
      features: [
        { icon: Clock, text: "Organização em um clique", color: "text-orange-400" },
        { icon: Trophy, text: "Perfil esportivo com histórico de partidas", color: "text-purple-400" },
        { icon: Star, text: "Notificações automáticas e confirmação coletiva", color: "text-pink-400" }
      ],
      image: "🏆"
    }
  ];

  const currentScreen = screens[step - 1];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Skip Button */}
      <button 
        onClick={onSkip}
        className="absolute top-8 right-6 text-white/70 hover:text-white transition-colors"
      >
        Pular
      </button>

      {/* Progress Indicator */}
      <div className="absolute top-8 left-6 flex space-x-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === step ? 'bg-[#F35410]' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <div className="max-w-md w-full text-center">
        {/* Main Emoji/Icon */}
        <div className="text-8xl mb-8 animate-bounce">
          {currentScreen.image}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-white">
          {currentScreen.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-white/80 mb-12">
          {currentScreen.subtitle}
        </p>

        {/* Features */}
        <div className="space-y-6 mb-12">
          {currentScreen.features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className={`p-2 rounded-full bg-white/20 ${feature.color}`}>
                <feature.icon size={24} />
              </div>
              <p className="text-white text-left font-medium">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <Button
          onClick={onNext}
          className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-4 text-lg font-semibold rounded-2xl transition-all transform hover:scale-105 shadow-lg"
        >
          {step === 2 ? 'Começar' : 'Próximo'}
          <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-8 w-20 h-20 bg-[#F35410]/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
    </div>
  );
};

export default OnboardingScreen;
