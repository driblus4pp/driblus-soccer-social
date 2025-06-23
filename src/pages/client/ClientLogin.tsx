import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const ClientLogin = () => {
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
      navigate('/cliente/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="absolute left-4 top-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" 
              alt="Driblus Logo" 
              className="h-8 object-contain"
            />
            <span className="text-white font-semibold text-lg">Driblus</span>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">Login do Cliente</CardTitle>
            <CardDescription className="text-white/70 text-center">
              Acesse sua conta para agendar quadras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input 
                  placeholder="Email" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} 
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" 
                  required 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input 
                  placeholder="Senha" 
                  type="password" 
                  value={formData.password} 
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))} 
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" 
                  required 
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3 rounded-xl font-semibold"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-white/70 text-sm">
                Não tem conta?{' '}
                <Link to="/cliente/cadastro" className="text-[#F35410] hover:underline">
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PWA Install Prompt */}
      {canInstall && (
        <PWAInstallPrompt
          show={showPrompt}
          onInstall={installApp}
          onDismiss={dismissPrompt}
        />
      )}
    </div>
  );
};

export default ClientLogin;
