import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Building, 
  MapPin, 
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourts } from "@/hooks/useCourts";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const AdminCourts = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { courts } = useCourts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');

  // Verificação de autenticação
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/admin/login');
    } else if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const filteredCourts = courts.filter(court => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = searchRegex.test(court.name) || searchRegex.test(court.location.city);

    const matchesStatus = statusFilter === 'all' || court.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  // Não renderizar se não estiver autenticado
  if (!user && !isLoading) {
    return null;
  }

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
              <h1 className="text-2xl font-bold">Gerenciar Quadras</h1>
              <p className="text-white/80 text-sm mt-1">Administre todas as quadras da plataforma</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Buscar quadras..."
              className="bg-white border-gray-300 text-gray-800 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B] border-[#F35410]' : 
              'border-gray-200 text-gray-700 hover:bg-gray-50'
            }
            size="sm"
          >
            Todas
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
            className={statusFilter === 'active' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B] border-[#F35410]' : 
              'border-gray-200 text-gray-700 hover:bg-gray-50'
            }
            size="sm"
          >
            Ativas
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            className={statusFilter === 'pending' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B] border-[#F35410]' : 
              'border-gray-200 text-gray-700 hover:bg-gray-50'
            }
            size="sm"
          >
            Pendentes
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('inactive')}
            className={statusFilter === 'inactive' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B] border-[#F35410]' : 
              'border-gray-200 text-gray-700 hover:bg-gray-50'
            }
            size="sm"
          >
            Inativas
          </Button>
        </div>
      </div>

      {/* Courts List */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourts.map(court => (
            <Card key={court.id} className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {court.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src={court.images[0]} 
                  alt={court.name} 
                  className="w-full h-40 object-cover rounded-md" 
                />
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{court.location.city}, {court.location.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600">{court.rating} ({court.reviews} avaliações)</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${
                    court.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : court.status === 'inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {court.status === 'active' ? 'Ativa' : 
                     court.status === 'inactive' ? 'Inativa' : 'Pendente'}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
