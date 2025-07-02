
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import PWAInstallBalloon from "@/components/PWAInstallBalloon";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { canInstall, showPrompt, installApp, dismissPrompt } = usePWAInstall();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3c5c] via-[#0f2a3f] to-[#0a1f2e] flex flex-col">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')} 
          className="text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo/Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-2">Driblus</h1>
          <p className="text-xl text-white/80 mb-4">Admin</p>
          <div className="w-16 h-1 bg-[#F35410] mx-auto rounded"></div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input 
                  placeholder="Login:" 
                  type="email"
                  value={formData.email} 
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))} 
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/60 rounded-lg text-base focus:border-[#F35410] focus:ring-[#F35410]" 
                  required 
                />
              </div>
              <div>
                <Input 
                  placeholder="Senha:" 
                  type="password"
                  value={formData.password} 
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))} 
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/60 rounded-lg text-base focus:border-[#F35410] focus:ring-[#F35410]" 
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-12 bg-[#F35410] hover:bg-[#BA2D0B] text-white rounded-full font-medium text-base"
            >
              {isLoading ? 'entrando...' : 'acessar painel admin'}
            </Button>
          </form>

          {/* Warning Message */}
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200 text-sm text-center">
              🔒 Acesso exclusivo para administradores da Driblus
            </p>
          </div>
        </div>
      </div>

      {/* PWA Install Balloon */}
      {canInstall && (
        <PWAInstallBalloon
          show={showPrompt}
          onInstall={installApp}
          onDismiss={dismissPrompt}
        />
      )}
    </div>
  );
};

export default AdminLogin;
