import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Minus, Save, Users } from "lucide-react";
import { QuickMatchPlayer, QuickMatchTeam } from '@/types/quickMatch';
import { useQuickMatches } from '@/hooks/useQuickMatches';

interface ScoreRecorderProps {
  onBack: () => void;
}

const ScoreRecorder = ({ onBack }: ScoreRecorderProps) => {
  const { saveQuickMatch } = useQuickMatches();
  const [teamA, setTeamA] = useState<QuickMatchTeam>({
    id: 'A',
    name: 'Time A',
    color: '#F35410',
    score: 0,
    players: []
  });
  
  const [teamB, setTeamB] = useState<QuickMatchTeam>({
    id: 'B',
    name: 'Time B',
    color: '#FDB600',
    score: 0,
    players: []
  });

  const [players, setPlayers] = useState<QuickMatchPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A');

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: QuickMatchPlayer = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        team: selectedTeam
      };

      setPlayers(prev => [...prev, newPlayer]);
      
      if (selectedTeam === 'A') {
        setTeamA(prev => ({ ...prev, players: [...prev.players, newPlayer.name] }));
      } else {
        setTeamB(prev => ({ ...prev, players: [...prev.players, newPlayer.name] }));
      }
      
      setNewPlayerName('');
    }
  };

  const updateScore = (team: 'A' | 'B', increment: boolean) => {
    if (team === 'A') {
      setTeamA(prev => ({
        ...prev,
        score: Math.max(0, prev.score + (increment ? 1 : -1))
      }));
    } else {
      setTeamB(prev => ({
        ...prev,
        score: Math.max(0, prev.score + (increment ? 1 : -1))
      }));
    }
  };

  const updatePlayerStat = (playerId: string, stat: keyof Pick<QuickMatchPlayer, 'goals' | 'assists' | 'yellowCards' | 'redCards'>, increment: boolean) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          [stat]: Math.max(0, player[stat] + (increment ? 1 : -1))
        };
      }
      return player;
    }));
  };

  const handleSave = async () => {
    await saveQuickMatch({
      type: 'score_record',
      teamA,
      teamB,
      players
    });
    onBack();
  };

  const getTeamPlayers = (team: 'A' | 'B') => {
    return players.filter(p => p.team === team);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-50">Registrar Pontuação</h1>
      </div>

      {/* Placar */}
      <div className="grid grid-cols-2 gap-4">
        {/* Time A */}
        <Card className="border-2" style={{ borderColor: teamA.color, backgroundColor: `${teamA.color}10` }}>
          <CardHeader className="text-center">
            <CardTitle style={{ color: teamA.color }}>{teamA.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-white bg-black/20 rounded-lg py-4">
              {teamA.score}
            </div>
            <div className="flex justify-center gap-2">
              <Button
                size="lg"
                onClick={() => updateScore('A', false)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <Minus className="w-6 h-6" />
              </Button>
              <Button
                size="lg"
                onClick={() => updateScore('A', true)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Time B */}
        <Card className="border-2" style={{ borderColor: teamB.color, backgroundColor: `${teamB.color}10` }}>
          <CardHeader className="text-center">
            <CardTitle style={{ color: teamB.color }}>{teamB.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-white bg-black/20 rounded-lg py-4">
              {teamB.score}
            </div>
            <div className="flex justify-center gap-2">
              <Button
                size="lg"
                onClick={() => updateScore('B', false)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <Minus className="w-6 h-6" />
              </Button>
              <Button
                size="lg"
                onClick={() => updateScore('B', true)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adicionar Jogadores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gerenciar Jogadores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nome do jogador"
              value={newPlayerName}
              onChange={e => setNewPlayerName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addPlayer()}
            />
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value as 'A' | 'B')}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="A">Time A</option>
              <option value="B">Time B</option>
            </select>
            <Button onClick={addPlayer}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas dos Jogadores */}
      {players.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time A Players */}
          <Card className="border-2" style={{ borderColor: teamA.color }}>
            <CardHeader>
              <CardTitle style={{ color: teamA.color }}>{teamA.name} - Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getTeamPlayers('A').map(player => (
                <div key={player.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="font-semibold">{player.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Gols:</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'goals', false)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Badge>{player.goals}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'goals', true)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Assist:</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'assists', false)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Badge>{player.assists}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'assists', true)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>🟨:</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'yellowCards', false)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Badge>{player.yellowCards}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'yellowCards', true)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>🟥:</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'redCards', false)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Badge>{player.redCards}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'redCards', true)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Time B Players */}
          <Card className="border-2" style={{ borderColor: teamB.color }}>
            <CardHeader>
              <CardTitle style={{ color: teamB.color }}>{teamB.name} - Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getTeamPlayers('B').map(player => (
                <div key={player.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="font-semibold">{player.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Gols:</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'goals', false)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Badge>{player.goals}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'goals', true)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Assist:</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'assists', false)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Badge>{player.assists}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'assists', true)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>🟨:</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'yellowCards', false)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Badge>{player.yellowCards}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'yellowCards', true)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>🟥:</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'redCards', false)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Badge>{player.redCards}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'redCards', true)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botão Salvar */}
      <div className="text-center">
        <Button 
          onClick={handleSave} 
          disabled={players.length === 0}
          className="bg-[#F35410] hover:bg-[#BA2D0B] text-white px-8 py-4 text-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar Partida
        </Button>
      </div>
    </div>
  );
};

export default ScoreRecorder;