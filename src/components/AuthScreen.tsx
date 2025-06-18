
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Phone } from "lucide-react";

interface AuthScreenProps {
  onComplete: () => void;
}

const AuthScreen = ({ onComplete }: AuthScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    setIsLoading(true);
    // Simular autenticação
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-3xl font-bold text-white mb-2">Driblus</h1>
          <p className="text-white/70">Conecte-se ao seu esporte favorito</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">Bem-vindo!</CardTitle>
            <CardDescription className="text-white/70 text-center">
              Entre ou crie sua conta para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input 
                      placeholder="Email" 
                      type="email"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input 
                      placeholder="Senha" 
                      type="password"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <Button 
                    onClick={handleAuth}
                    disabled={isLoading}
                    className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3 rounded-xl font-semibold"
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input 
                      placeholder="Nome completo" 
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input 
                      placeholder="Email" 
                      type="email"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input 
                      placeholder="Telefone" 
                      type="tel"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input 
                      placeholder="Senha" 
                      type="password"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <Button 
                    onClick={handleAuth}
                    disabled={isLoading}
                    className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3 rounded-xl font-semibold"
                  >
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/60">ou</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 bg-white text-[#062B4B] border-white hover:bg-white/90"
                onClick={handleAuth}
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 h-4 mr-2" />
                Continuar com Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-8 w-20 h-20 bg-[#F35410]/20 rounded-full blur-xl animate-pulse"></div>
      <div className="fixed bottom-1/4 right-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
    </div>
  );
};

export default AuthScreen;
