
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Medal, TrendingUp, Plus } from "lucide-react";
import { useAthleteProfile } from '@/hooks/useAthleteProfile';

interface AthleteDashboardProps {
  onAddMatch: () => void;
  onViewHistory: () => void;
  onTeamSorter: () => void;
}

const AthleteDashboard = ({ onAddMatch, onViewHistory, onTeamSorter }: AthleteDashboardProps) => {
  const { profile, getNextLevelExp, getWinRate } = useAthleteProfile();

  if (!profile) return <div>Carregando perfil...</div>;

  const experienceProgress = ((profile.experience % 200) / 200) * 100;

  return (
    <div className="space-y-6">
      {/* Header do Atleta */}
      <Card className="bg-gradient-to-r from-[#F35410] to-[#BA2D0B] border-none text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              🏃‍♂️
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Atleta Nível {profile.level}</h2>
              <p className="text-white/80">{profile.athleteType}</p>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>XP: {profile.experience}</span>
                  <span>Próximo nível: {getNextLevelExp()}</span>
                </div>
                <Progress value={experienceProgress} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">{profile.wins}</p>
            <p className="text-sm text-green-600">Vitórias</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">{getWinRate()}%</p>
            <p className="text-sm text-blue-600">Taxa de Vitória</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Medal className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-700">{profile.badges.length}</p>
            <p className="text-sm text-purple-600">Conquistas</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-700">{profile.totalMatches}</p>
            <p className="text-sm text-orange-600">Partidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="w-5 h-5" />
            Conquistas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {profile.badges.map((badge) => (
              <Badge key={badge.id} 
                     variant="secondary" 
                     className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800">
                <span className="mr-1">{badge.icon}</span>
                {badge.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={onAddMatch} className="h-16 bg-[#F35410] hover:bg-[#BA2D0B]">
          <Plus className="w-5 h-5 mr-2" />
          Registrar Partida
        </Button>
        
        <Button onClick={onViewHistory} variant="outline" className="h-16">
          <Trophy className="w-5 h-5 mr-2" />
          Histórico de Jogos
        </Button>
        
        <Button onClick={onTeamSorter} variant="outline" className="h-16">
          <Target className="w-5 h-5 mr-2" />
          Sortear Times
        </Button>
      </div>
    </div>
  );
};

export default AthleteDashboard;
