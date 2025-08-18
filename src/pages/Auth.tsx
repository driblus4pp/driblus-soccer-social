import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginForm.email, loginForm.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(registerForm);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3c5c] via-[#0f2a3f] to-[#0a1f2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-orange-700">Driblus</h1>
          <div className="w-16 h-1 bg-[#F35410] mx-auto rounded"></div>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">Bem-vindo!</CardTitle>
            <CardDescription className="text-white/70 text-center">
              Faça login ou crie sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/20">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
                  Cadastro
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Senha"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
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
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Nome completo"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Telefone (com DDD)"
                      type="tel"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Senha"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3 rounded-xl font-semibold"
                  >
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;