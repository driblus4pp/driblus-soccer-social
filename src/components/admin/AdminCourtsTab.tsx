import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Users,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { useCourts } from "@/hooks/useCourts";
import { useNavigate } from "react-router-dom";

const AdminCourtsTab = () => {
  const { courts } = useCourts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_approval' | 'inactive'>('all');

  const filteredCourts = courts.filter(court => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = searchRegex.test(court.name) || searchRegex.test(court.location.city);
    const matchesStatus = statusFilter === 'all' || court.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const courtsStats = {
    total: courts.length,
    active: courts.filter(c => c.status === 'active').length,
    pending: courts.filter(c => c.status === 'pending_approval').length,
    averageRating: courts.reduce((sum, c) => sum + c.rating, 0) / courts.length || 0,
    totalRevenue: courts.reduce((sum, c) => sum + (c.hourlyRate || 0) * 100, 0) // Simulado
  };

  const handleViewCourt = (courtId: string) => {
    navigate(`/admin/court/${courtId}`);
  };

  const handleEditCourt = (courtId: string) => {
    console.log('Edit court:', courtId);
  };

  const handleDeleteCourt = (courtId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta quadra?')) {
      console.log('Delete court:', courtId);
    }
  };

  const handleCreateCourt = () => {
    navigate('/admin/create-court');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quadras</p>
                <p className="text-2xl font-bold text-gray-900">{courtsStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Quadras Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{courtsStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{courtsStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                <p className="text-2xl font-bold text-gray-900">{courtsStats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
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
        <Button 
          onClick={handleCreateCourt}
          className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Quadra
        </Button>
      </div>

      {/* Status Filters */}
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
            variant={statusFilter === 'pending_approval' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending_approval')}
            className={statusFilter === 'pending_approval' ? 
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

      {/* Courts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourts.map(court => (
          <Card key={court.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
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
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-gray-600">{court.rating} ({court.totalReviews} avaliações)</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">R$ {court.hourlyRate || 0}/hora</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${
                  court.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : court.status === 'inactive'
                    ? 'bg-red-100 text-red-800'
                    : court.status === 'pending_approval'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {court.status === 'active' ? 'Ativa' : 
                   court.status === 'inactive' ? 'Inativa' : 
                   court.status === 'pending_approval' ? 'Pendente' : 'Manutenção'}
                </Badge>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleViewCourt(court.id)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    title="Visualizar quadra"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEditCourt(court.id)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    title="Editar quadra"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDeleteCourt(court.id)}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    title="Excluir quadra"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCourtsTab;