import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Camera, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const ManagerEditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleSaveProfile = async () => {
    const updatedData = {
      name,
      phone,
      avatar,
    };

    const success = await updateUserProfile(updatedData);
    if (success) {
      alert('Perfil atualizado com sucesso!');
      navigate('/gestor/perfil');
    } else {
      alert('Erro ao atualizar o perfil.');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/gestor/perfil')} 
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Editar Perfil</h1>
              <p className="text-white/80 text-sm">Atualize suas informações</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Card de Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="rounded-full w-24 h-24 object-cover"
                />
                <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-gray-200 text-gray-700 rounded-full p-2 cursor-pointer hover:bg-gray-300 transition">
                  <Camera className="w-4 h-4" />
                </Label>
                <Input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end">
          <Button onClick={handleSaveProfile} className="bg-[#F35410] hover:bg-[#BA2D0B] text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <BottomNavigation userType="manager" />
    </div>
  );
};

export default ManagerEditProfile;
