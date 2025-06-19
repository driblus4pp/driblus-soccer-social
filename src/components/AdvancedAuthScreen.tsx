import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Phone, Building, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
interface AdvancedAuthScreenProps {
  onComplete: () => void;
}
const AdvancedAuthScreen = ({
  onComplete
}: AdvancedAuthScreenProps) => {
  const {
    login,
    register,
    isLoading
  } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user' as 'user' | 'owner'
  });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      onComplete();
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      onComplete();
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/lovable-uploads/cf887f3e-6da7-4137-b0d3-d752d0777b28.png" alt="Soccer ball" className="w-12 h-12 object-contain" />
            <img src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" alt="Driblus Logo" className="h-12 object-contain" />
          </div>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
                <TabsTrigger value="login" className="text-white data-[state=active]:text-white bg-gray-500 hover:bg-gray-400">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-[#F35410] data-[state=active]:text-white">
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input placeholder="Email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input placeholder="Senha" type="password" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3 rounded-xl font-semibold">
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input placeholder="Nome completo" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input placeholder="Email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input placeholder="Telefone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input placeholder="Senha" type="password" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white font-medium">Tipo de conta:</Label>
                    <RadioGroup value={formData.role} onValueChange={value => handleInputChange('role', value)} className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user" className="text-white flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          Usuário - Buscar e agendar quadras
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
                        <RadioGroupItem value="owner" id="owner" />
                        <Label htmlFor="owner" className="text-white flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Dono de quadra - Disponibilizar espaços
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3 rounded-xl font-semibold">
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
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
              <Button variant="outline" className="w-full mt-4 bg-white text-[#062B4B] border-white hover:bg-white/90" onClick={() => handleLogin({
              preventDefault: () => {}
            } as any)}>
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 h-4 mr-2" />
                Continuar com Google
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-white/60 text-xs">
            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
          </p>
        </div>
      </div>

      {/* PWA Install hint */}
      <div className="fixed bottom-4 left-4 right-4 bg-[#F35410] text-white p-3 rounded-lg text-sm text-center opacity-90">
        💡 Instale o Driblus como app para uma melhor experiência!
      </div>
    </div>;
};
export default AdvancedAuthScreen;