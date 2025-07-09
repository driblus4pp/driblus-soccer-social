import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone, 
  UserCheck, 
  UserX,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { UserRole } from "@/types";

const AdminUsersTab = () => {
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'manager'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isVerified).length,
    newThisMonth: users.filter(u => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return u.createdAt > monthAgo;
    }).length,
    totalSpent: users.reduce((sum, u) => sum + (u.stats?.totalSpent || 0), 0)
  };

  const handleViewUser = (userId: string) => {
    console.log('View user:', userId);
  };

  const handleContactUser = (userId: string) => {
    console.log('Contact user:', userId);
  };

  const handleToggleStatus = (userId: string) => {
    console.log('Toggle user status:', userId);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Novos (30d)</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.newThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {userStats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Buscar usuários..."
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

        <div className="flex gap-2">
          <Button
            variant={roleFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setRoleFilter('all')}
            className={roleFilter === 'all' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B] border-[#F35410]' : 
              'border-gray-200 text-gray-700 hover:bg-gray-50'
            }
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={roleFilter === 'user' ? 'default' : 'outline'}
            onClick={() => setRoleFilter('user')}
            className={roleFilter === 'user' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B] border-[#F35410]' : 
              'border-gray-200 text-gray-700 hover:bg-gray-50'
            }
            size="sm"
          >
            Clientes
          </Button>
          <Button
            variant={roleFilter === 'manager' ? 'default' : 'outline'}
            onClick={() => setRoleFilter('manager')}
            className={roleFilter === 'manager' ? 
              'bg-[#F35410] hover:bg-[#BA2D0B] border-[#F35410]' : 
              'border-gray-200 text-gray-700 hover:bg-gray-50'
            }
            size="sm"
          >
            Gestores
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuários da Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <Badge className={`text-xs ${
                        user.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isVerified ? 'Verificado' : 'Pendente'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {user.stats?.totalBookings || 0} reservas
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          R$ {(user.stats?.totalSpent || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewUser(user.id)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleContactUser(user.id)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Contatar
                  </Button>
                  <Button 
                    variant={user.isVerified ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(user.id)}
                    className={user.isVerified ? 
                      "border-red-300 text-red-700 hover:bg-red-50" : 
                      "bg-green-600 hover:bg-green-700 text-white"
                    }
                  >
                    {user.isVerified ? (
                      <>
                        <UserX className="w-4 h-4 mr-1" />
                        Suspender
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        Ativar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersTab;