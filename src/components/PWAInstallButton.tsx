import { Download, Check, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useToast } from '@/hooks/use-toast';

interface PWAInstallButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "lg" | "default" | "icon";
  className?: string;
}

const PWAInstallButton = ({ 
  variant = "default", 
  size = "default", 
  className = "" 
}: PWAInstallButtonProps) => {
  const { canInstall, installApp } = usePWAInstall();
  const { toast } = useToast();

  const handleInstall = async () => {
    await installApp();
    toast({
      title: "Instalando App...",
      description: "Siga as instruções para instalar o Driblus",
      duration: 3000,
    });
  };

  // Don't render if not installable
  if (!canInstall) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      variant={variant}
      size={size}
      className={`${className} gap-2`}
    >
      <Download className="w-4 h-4" />
      Instalar App
    </Button>
  );
};

export default PWAInstallButton;