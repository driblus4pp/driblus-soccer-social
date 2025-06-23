
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Download, Smartphone, Tablet, Monitor } from "lucide-react";

interface PWAInstallPromptProps {
  onInstall: () => void;
  onDismiss: (permanent?: boolean) => void;
  show: boolean;
}

const PWAInstallPrompt = ({ onInstall, onDismiss, show }: PWAInstallPromptProps) => {
  const [isVisible, setIsVisible] = useState(show);

  if (!show && !isVisible) return null;

  const handleDismiss = (permanent = false) => {
    setIsVisible(false);
    setTimeout(() => onDismiss(permanent), 300);
  };

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      show && isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <Card className={`w-full max-w-md bg-white/95 backdrop-blur-md border-white/20 shadow-2xl transform transition-all duration-300 ${
        show && isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 text-gray-500 hover:text-gray-700"
            onClick={() => handleDismiss()}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" 
              alt="Driblus Logo" 
              className="h-8 object-contain"
            />
            <Download className="w-6 h-6 text-[#F35410]" />
          </div>
          
          <CardTitle className="text-gray-900">Instalar Driblus</CardTitle>
          <CardDescription className="text-gray-600">
            Baixe nosso app para uma experiência ainda melhor!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-[#F35410]/10 rounded-lg">
                <Smartphone className="w-6 h-6 text-[#F35410]" />
              </div>
              <span className="text-xs text-gray-600">Celular</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-[#F35410]/10 rounded-lg">
                <Tablet className="w-6 h-6 text-[#F35410]" />
              </div>
              <span className="text-xs text-gray-600">Tablet</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-[#F35410]/10 rounded-lg">
                <Monitor className="w-6 h-6 text-[#F35410]" />
              </div>
              <span className="text-xs text-gray-600">Desktop</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#F35410] rounded-full"></div>
              <span>Acesso rápido sem abrir o navegador</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#F35410] rounded-full"></div>
              <span>Notificações de agendamentos confirmados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#F35410] rounded-full"></div>
              <span>Funciona mesmo sem internet</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onInstall}
              className="flex-1 bg-[#F35410] hover:bg-[#BA2D0B] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar App
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDismiss()}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Agora Não
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDismiss(true)}
            className="w-full text-gray-500 hover:text-gray-700 text-xs"
          >
            Não mostrar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
