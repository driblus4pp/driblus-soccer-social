
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Plus, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SportType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface AdminCourtCreatorProps {
  onCourtCreated: () => void;
}

const AdminCourtCreator = ({ onCourtCreated }: AdminCourtCreatorProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [courtData, setCourtData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: 'CE',
    hourlyRate: 0,
    sport: SportType.FOOTBALL,
    managerEmail: '',
    managerName: '',
    managerPhone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // 1. Criar gestor usando edge function
      const { data: managerData, error: managerError } = await supabase.functions.invoke('create-manager', {
        body: {
          email: courtData.managerEmail,
          password: '123456', // Senha temporária
          nome: courtData.managerName,
          telefone: courtData.managerPhone
        }
      });

      if (managerError) throw managerError;

      // 2. Criar quadra com gestor vinculado
      const { error: courtError } = await supabase
        .from('quadras')
        .insert({
          nome: courtData.name,
          descricao: courtData.description,
          endereco: courtData.address,
          cidade: courtData.city,
          bairro: courtData.state,
          modalidade: courtData.sport,
          gestor_id: managerData.userId,
          ativa: true
        });

      if (courtError) throw courtError;

      toast({
        title: "Quadra e Gestor Criados!",
        description: `${courtData.name} foi criada. Credenciais enviadas para ${courtData.managerEmail}`
      });
      
      // Reset form
      setCourtData({
        name: '',
        description: '',
        address: '',
        city: '',
        state: 'CE',
        hourlyRate: 0,
        sport: SportType.FOOTBALL,
        managerEmail: '',
        managerName: '',
        managerPhone: ''
      });
      
      onCourtCreated();
    } catch (error: any) {
      console.error('Error creating court:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar quadra e gestor",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Criar Nova Quadra
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações da Quadra */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Building className="w-4 h-4" />
              Dados da Quadra
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Quadra *</Label>
                <Input
                  id="name"
                  value={courtData.name}
                  onChange={(e) => setCourtData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Arena Sports Center"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sport">Modalidade *</Label>
                <Select value={courtData.sport} onValueChange={(value: SportType) => setCourtData(prev => ({ ...prev, sport: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SportType.FOOTBALL}>Futebol Society</SelectItem>
                    <SelectItem value={SportType.FUTSAL}>Futsal</SelectItem>
                    <SelectItem value={SportType.BASKETBALL}>Basquete</SelectItem>
                    <SelectItem value={SportType.VOLLEYBALL}>Vôlei</SelectItem>
                    <SelectItem value={SportType.TENNIS}>Tênis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={courtData.description}
                onChange={(e) => setCourtData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva a quadra, comodidades, diferenciais..."
                className="min-h-20"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Localização
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    value={courtData.address}
                    onChange={(e) => setCourtData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, número, bairro"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={courtData.city}
                    onChange={(e) => setCourtData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Fortaleza"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Preço por Hora (R$) *</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={courtData.hourlyRate}
                onChange={(e) => setCourtData(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                placeholder="120"
                required
                min="0"
              />
            </div>
          </div>

          {/* Informações do Gestor */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Dados do Gestor
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="managerName">Nome do Gestor *</Label>
                <Input
                  id="managerName"
                  value={courtData.managerName}
                  onChange={(e) => setCourtData(prev => ({ ...prev, managerName: e.target.value }))}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerPhone">Telefone</Label>
                <Input
                  id="managerPhone"
                  value={courtData.managerPhone}
                  onChange={(e) => setCourtData(prev => ({ ...prev, managerPhone: e.target.value }))}
                  placeholder="(85) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerEmail">Email do Gestor *</Label>
              <Input
                id="managerEmail"
                type="email"
                value={courtData.managerEmail}
                onChange={(e) => setCourtData(prev => ({ ...prev, managerEmail: e.target.value }))}
                placeholder="gestor@email.com"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Credenciais do Gestor:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-1">
                <li>• Email: {courtData.managerEmail || 'gestor@email.com'}</li>
                <li>• Senha temporária: <strong>123456</strong></li>
                <li>• O gestor deverá alterar a senha no primeiro acesso</li>
              </ul>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#F35410] hover:bg-[#BA2D0B]"
            disabled={isCreating}
          >
            {isCreating ? "Criando..." : "Criar Quadra e Gestor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminCourtCreator;
