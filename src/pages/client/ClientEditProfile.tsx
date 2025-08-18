
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, MapPin, Camera, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SportType } from "@/types";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const ClientEditProfile = () => {
  const navigate = useNavigate();
  const { user, profile, updateUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: profile?.nome || '',
    email: user?.email || '',
    telefone: profile?.telefone || ''
  });

  const [selectedSports, setSelectedSports] = useState<SportType[]>([]);

  // Mapping of SportType enum to Portuguese display names
  const sportDisplayNames: Record<SportType, string> = {
    [SportType.FOOTBALL]: 'Futebol',
    [SportType.FUTSAL]: 'Futsal',
    [SportType.VOLLEYBALL]: 'Vôlei',
    [SportType.BASKETBALL]: 'Basquete',
    [SportType.TENNIS]: 'Tênis',
    [SportType.PADEL]: 'Padel'
  };

  const availableSports = Object.values(SportType);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSport = (sport: SportType) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
    const success = await updateUserProfile({
      nome: formData.nome,
      telefone: formData.telefone
    });
    
    if (success) {
      navigate('/cliente/perfil');
    }

      if (success) {
        navigate('/cliente/perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#093758] pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-[#093758]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/cliente/perfil')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-white">Editar Perfil</h1>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Foto do Perfil */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-[#F35410] rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <Button 
                  size="icon" 
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-[#093758] hover:bg-gray-100 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-white font-semibold">Foto do Perfil</h3>
                <p className="text-white/70 text-sm">Clique para alterar sua foto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white mb-2 block">Nome Completo</Label>
              <Input
                id="name"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white mb-2 block">Telefone</Label>
              <Input
                id="phone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="(85) 99999-9999"
              />
            </div>
          </CardContent>
        </Card>

        {/* Esportes Preferidos */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Esportes Preferidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableSports.map((sport) => {
                const isSelected = selectedSports.includes(sport);
                return (
                  <Badge
                    key={sport}
                    onClick={() => toggleSport(sport)}
                    className={`cursor-pointer ${
                      isSelected 
                        ? 'bg-[#F35410] hover:bg-[#BA2D0B] text-white' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    {sportDisplayNames[sport]}
                    {isSelected && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
            <p className="text-white/70 text-sm mt-2">
              Selecione seus esportes favoritos para receber recomendações personalizadas
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation userType="client" />
    </div>
  );
};

export default ClientEditProfile;
