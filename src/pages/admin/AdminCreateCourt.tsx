
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import AdminCourtCreator from "@/components/admin/AdminCourtCreator";

const AdminCreateCourt = () => {
  const navigate = useNavigate();

  const handleCourtCreated = () => {
    // Redirecionar para lista de quadras após criação
    navigate('/admin/quadras');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062B4B] to-[#0A3B5C] text-white p-6">
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
            <h1 className="text-xl font-semibold">Nova Quadra</h1>
            <p className="text-white/80 text-sm">Criar quadra e gestor responsável</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <AdminCourtCreator onCourtCreated={handleCourtCreated} />
      </div>

      <BottomNavigation userType="admin" />
    </div>
  );
};

export default AdminCreateCourt;
