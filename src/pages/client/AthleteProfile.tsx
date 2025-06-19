
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AthleteDashboard from '@/components/athlete/AthleteDashboard';
import MatchRecorder from '@/components/athlete/MatchRecorder';
import TeamSorter from '@/components/athlete/TeamSorter';

type ViewMode = 'dashboard' | 'match-recorder' | 'team-sorter' | 'history';

const AthleteProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'match-recorder':
        return <MatchRecorder onBack={() => setCurrentView('dashboard')} />;
      case 'team-sorter':
        return <TeamSorter onBack={() => setCurrentView('dashboard')} />;
      case 'history':
        // TODO: Implementar histórico de partidas
        return <div>Histórico em desenvolvimento...</div>;
      default:
        return (
          <AthleteDashboard
            onAddMatch={() => setCurrentView('match-recorder')}
            onViewHistory={() => setCurrentView('history')}
            onTeamSorter={() => setCurrentView('team-sorter')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062B4B] via-[#0A3B5C] to-[#062B4B]">
      {/* Header */}
      {currentView === 'dashboard' && (
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cliente/dashboard')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/6a0f382f-4f6a-4afd-a007-454b98a5807a.png" alt="Driblus Logo" className="h-8 object-contain" />
              <h1 className="text-xl font-bold text-white">Meu Perfil de Atleta</h1>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AthleteProfile;
