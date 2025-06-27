import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, Shield, Bell, Users, Database, Palette, ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
const AdminSettings = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062B4B] to-[#0A3B5C] text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Configurações</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Configurações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo de Manutenção</p>
                <p className="text-sm text-gray-600">Desabilitar acesso ao sistema</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Logs Detalhados</p>
                <p className="text-sm text-gray-600">Registrar ações dos usuários</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Segurança */}
        <Card>
          
          
        </Card>

        {/* Configurações de Notificações */}
        

        {/* Configurações de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-3" />
              Gerenciar Tipos de Usuário
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-3" />
              Políticas de Senha
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-3" />
              Exportar Dados
            </Button>
          </CardContent>
        </Card>

        {/* Configurações de Aparência */}
        
      </div>

      <BottomNavigation userType="admin" />
    </div>;
};
export default AdminSettings;