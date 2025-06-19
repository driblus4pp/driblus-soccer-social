
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trophy } from "lucide-react";
import { SportType, MatchRecord, PlayerStats } from '@/types/athlete';
import { useAthleteProfile } from '@/hooks/useAthleteProfile';
import { useToast } from '@/hooks/use-toast';

interface MatchRecorderProps {
  onBack: () => void;
}

const MatchRecorder = ({ onBack }: MatchRecorderProps) => {
  const { addMatchRecord } = useAthleteProfile();
  const { toast } = useToast();
  const [sportType, setSportType] = useState<SportType>(SportType.FOOTBALL);
  const [formData, setFormData] = useState({
    venue: '',
    teamAName: 'Meu Time',
    teamBName: 'Adversário',
    scoreA: 0,
    scoreB: 0,
    myTeam: 'A' as 'A' | 'B',
    highlights: '',
    rating: 5
  });

  const [myStats, setMyStats] = useState<PlayerStats>({
    goals: 0,
    assists: 0,
    fouls: 0,
    mvp: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const match: Omit<MatchRecord, 'id'> = {
      userId: '1', // TODO: usar user real
      sportType,
      date: new Date(),
      venue: formData.venue,
      teamA: {
        name: formData.teamAName,
        players: [],
        score: formData.scoreA,
        color: '#3B82F6'
      },
      teamB: {
        name: formData.teamBName,
        players: [],
        score: formData.scoreB,
        color: '#EF4444'
      },
      result: {
        scoreA: formData.scoreA,
        scoreB: formData.scoreB,
        winner: formData.scoreA > formData.scoreB ? 'A' : 
                formData.scoreB > formData.scoreA ? 'B' : 'draw',
        duration: 90
      },
      myTeam: formData.myTeam,
      myStats,
      highlights: formData.highlights,
      rating: formData.rating,
      tags: []
    };

    addMatchRecord(match);
    
    toast({
      title: "🎉 Partida Registrada!",
      description: `Você ganhou 50 XP! ${myStats.mvp ? '+25 XP de bônus MVP!' : ''}`,
    });

    onBack();
  };

  const getStatFields = () => {
    switch (sportType) {
      case SportType.FOOTBALL:
      case SportType.FUTSAL:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gols</Label>
                <Input 
                  type="number" 
                  value={myStats.goals || 0}
                  onChange={(e) => setMyStats(prev => ({ ...prev, goals: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>Assistências</Label>
                <Input 
                  type="number" 
                  value={myStats.assists || 0}
                  onChange={(e) => setMyStats(prev => ({ ...prev, assists: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </>
        );
      case SportType.BASKETBALL:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pontos</Label>
                <Input 
                  type="number" 
                  value={myStats.points || 0}
                  onChange={(e) => setMyStats(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>Rebotes</Label>
                <Input 
                  type="number" 
                  value={myStats.rebounds || 0}
                  onChange={(e) => setMyStats(prev => ({ ...prev, rebounds: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </>
        );
      case SportType.VOLLEYBALL:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Aces</Label>
                <Input 
                  type="number" 
                  value={myStats.aces || 0}
                  onChange={(e) => setMyStats(prev => ({ ...prev, aces: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>Cortadas</Label>
                <Input 
                  type="number" 
                  value={myStats.spikes || 0}
                  onChange={(e) => setMyStats(prev => ({ ...prev, spikes: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Registrar Partida 🏆</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Partida</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Modalidade Esportiva</Label>
              <Select value={sportType} onValueChange={(value) => setSportType(value as SportType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SportType.FOOTBALL}>⚽ Futebol Society</SelectItem>
                  <SelectItem value={SportType.FUTSAL}>🥅 Futsal</SelectItem>
                  <SelectItem value={SportType.VOLLEYBALL}>🏐 Vôlei</SelectItem>
                  <SelectItem value={SportType.BASKETBALL}>🏀 Basquete</SelectItem>
                  <SelectItem value={SportType.FOOTVOLLEY}>🦶 Futevôlei</SelectItem>
                  <SelectItem value={SportType.BEACH_TENNIS}>🎾 Beach Tennis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Local da Partida</Label>
              <Input 
                placeholder="Ex: Quadra Arena Sports"
                value={formData.venue}
                onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Meu Time</Label>
                <Input 
                  value={formData.teamAName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamAName: e.target.value }))}
                />
              </div>
              <div>
                <Label>Time Adversário</Label>
                <Input 
                  value={formData.teamBName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamBName: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Placar - Meu Time</Label>
                <Input 
                  type="number"
                  value={formData.scoreA}
                  onChange={(e) => setFormData(prev => ({ ...prev, scoreA: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>Placar - Adversário</Label>
                <Input 
                  type="number"
                  value={formData.scoreB}
                  onChange={(e) => setFormData(prev => ({ ...prev, scoreB: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Minhas Estatísticas 📊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getStatFields()}
                
                <div>
                  <Label>Faltas Cometidas</Label>
                  <Input 
                    type="number" 
                    value={myStats.fouls}
                    onChange={(e) => setMyStats(prev => ({ ...prev, fouls: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Fui o MVP da partida? 🌟</Label>
                  <Switch 
                    checked={myStats.mvp}
                    onCheckedChange={(checked) => setMyStats(prev => ({ ...prev, mvp: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <div>
              <Label>Highlights da Partida</Label>
              <Textarea 
                placeholder="Conte como foi o jogo, momentos marcantes, jogadas especiais..."
                value={formData.highlights}
                onChange={(e) => setFormData(prev => ({ ...prev, highlights: e.target.value }))}
              />
            </div>

            <Button type="submit" className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white py-3">
              <Save className="w-4 h-4 mr-2" />
              Salvar Partida
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchRecorder;
