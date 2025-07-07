import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Star, Plus, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const AdminCourts = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const mockCourts = [
    {
      id: 'court-1',
      name: 'Arena Sports Center',
      location: {
        city: 'São Paulo',
        state: 'SP'
      },
      status: 'active',
      rating: 4.5,
      image: 'https://source.unsplash.com/400x300/?sports,arena'
    },
    {
      id: 'court-2',
      name: 'Quadra Society',
      location: {
        city: 'Rio de Janeiro',
        state: 'RJ'
      },
      status: 'pending',
      rating: 3.8,
      image: 'https://source.unsplash.com/400x300/?football,field'
    },
    {
      id: 'court-3',
      name: 'Play Sports',
      location: {
        city: 'Fortaleza',
        state: 'CE'
      },
      status: 'active',
      rating: 4.9,
      image: 'https://source.unsplash.com/400x300/?tennis,court'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativa</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pendente</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062B4B] to-[#0A3B5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin/dashboard')} 
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Gestão de Quadras</h1>
              <p className="text-white/80 text-sm">Monitore e gerencie todas as quadras</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => navigate('/admin/quadras/nova')}
              className="bg-[#F35410] hover:bg-[#BA2D0B]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Quadra
            </Button>
            <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/20">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Lista de Quadras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCourts.map(court => (
            <Card key={court.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={court.image} alt={court.name} className="w-full h-40 object-cover" />
              <CardContent className="p-4">
                <CardHeader className="mb-2">
                  <CardTitle className="text-lg font-semibold">{court.name}</CardTitle>
                </CardHeader>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  {court.location.city}, {court.location.state}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{court.rating}</span>
                  </div>
                  {getStatusBadge(court.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminCourts;
