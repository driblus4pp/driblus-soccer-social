
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface PWAInstallBalloonProps {
  onInstall: () => void;
  onDismiss: (permanent?: boolean) => void;
  show: boolean;
}

const PWAInstallBalloon = ({ onInstall, onDismiss, show }: PWAInstallBalloonProps) => {
  console.log('PWAInstallBalloon: Renderizando com show =', show);

  if (!show) {
    console.log('PWAInstallBalloon: Não renderizando (show = false)');
    return null;
  }

  const handleDismiss = (permanent = false) => {
    console.log('PWAInstallBalloon: Dismiss clicado, permanent =', permanent);
    onDismiss(permanent);
  };

  const handleInstall = () => {
    console.log('PWAInstallBalloon: Install clicado');
    onInstall();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] transform transition-all duration-300 animate-in slide-in-from-bottom-4">
      <div className="bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-4 max-w-[300px]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" 
              alt="Driblus" 
              className="h-6 object-contain"
            />
            <Download className="w-4 h-4 text-[#F35410]" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-500 hover:text-gray-700 -mt-1 -mr-1"
            onClick={() => handleDismiss()}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Instalar Driblus</h4>
            <p className="text-xs text-gray-600 mt-1">
              Baixe nosso app para acesso rápido!
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              size="sm"
              className="flex-1 bg-[#F35410] hover:bg-[#BA2D0B] text-white text-xs h-8"
            >
              Instalar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDismiss(true)}
              className="text-xs h-8 px-3 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Não
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBalloon;
