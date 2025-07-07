import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Eye,
  CheckCircle,
  Clock,
  Building,
  Plus
} from "lucide-react";
import { useCourts } from "@/hooks/useCourts";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import CourtApprovalModal from "@/components/CourtApprovalModal";
import { Court } from '@/types';

const AdminCourts = () => {
  const navigate = useNavigate();
  const { courts } = useCourts();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_approval' | 'inactive'>('all');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const filteredCourts = courts.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         court.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || court.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: courts.length,
    active: courts.filter(c => c.status === 'active').length,
    pending: courts.filter(c => c.status === 'pending_approval').length,
    inactive: courts.filter(c => c.status === 'inactive').length
  };

  const handleApprovalClick = (court: Court) => {
    setSelectedCourt(court);
    setIsApprovalModalOpen(true);
  };

  const handleApproveCourt = (courtId: string, comment?: string) => {
    // Aqui seria feita a chamada para o backend
    toast({
      title: "Quadra Aprovada",
      description: "A quadra foi aprovada e está agora ativa na plataforma.",
    });
    
    console.log('Aprovando quadra:', courtId, 'Comentário:', comment);
  };

  const handleRejectCourt = (courtId: string, comment: string) => {
    // Aqui seria feita a chamada para o backend
    toast({
      title: "Quadra Reprovada",
      description: "A quadra foi reprovada e o gestor foi notificado.",
      variant: "destructive"
    });
    
    console.log('Reprovando quadra:', courtId, 'Motivo:', comment);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inativa</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062B4B] to-[#0A3B5C] text-white p-6">
        <div className="flex items-center justify-between mb-4">
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
              <h1 className="text-xl font-semibold">Gerenciar Quadras</h1>
              <p className="text-white/80 text-sm">
                {stats.pending} quadras aguardando aprovação
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/quadras/nova')}
            className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Quadra
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-white/80">Total</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-300">{stats.active}</div>
            <div className="text-xs text-white/80">Ativas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-300">{stats.pending}</div>
            <div className="text-xs text-white/80">Pendentes</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-300">{stats.inactive}</div>
            <div className="text-xs text-white/80">Inativas</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar quadras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="pending_approval">Pendentes</SelectItem>
              <SelectItem value="inactive">Inativas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Courts List */}
        <div className="space-y-3">
          {filteredCourts.map(court => (
            <Card key={court.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={court.images[0]} 
                    alt={court.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{court.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{court.location.city}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{court.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(court.status)}
                          <span className="text-sm font-semibold text-gray-800">
                            R$ {court.hourlyRate}/hora
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/quadras/${court.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {court.status === 'pending_approval' && (
                          <Button
                            size="sm"
                            onClick={() => handleApprovalClick(court)}
                            className="bg-[#F35410] hover:bg-[#BA2D0B] text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Avaliar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Nenhuma quadra encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>

      <CourtApprovalModal
        court={selectedCourt}
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onApprove={handleApproveCourt}
        onReject={handleRejectCourt}
      />
      
      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminCourts;
