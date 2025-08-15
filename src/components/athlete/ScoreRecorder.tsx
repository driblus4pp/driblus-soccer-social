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
        <h1 className="text-xl font-bold text-slate-50">Registrar Pontuação</h1>
      </div>

      {/* Placar */}
      <div className="grid grid-cols-2 gap-3">
        {/* Time 1 */}
        <div className="bg-[#F35410] rounded-2xl p-6 text-center text-white">
          <div className="text-sm font-medium mb-2">Time 1</div>
          <div className="text-5xl font-bold mb-4">{teamA.score.toString().padStart(2, '0')}</div>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => updateScore('A', true)}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 text-white text-lg font-bold"
            >
              +
            </Button>
            <Button
              onClick={() => updateScore('A', false)}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 text-white text-lg font-bold"
            >
              -1
            </Button>
          </div>
        </div>

        {/* Time 2 */}
        <div className="bg-[#FDB600] rounded-2xl p-6 text-center text-white">
          <div className="text-sm font-medium mb-2">Time 2</div>
          <div className="text-5xl font-bold mb-4">{teamB.score.toString().padStart(2, '0')}</div>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => updateScore('B', true)}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 text-white text-lg font-bold"
            >
              +
            </Button>
            <Button
              onClick={() => updateScore('B', false)}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 text-white text-lg font-bold"
            >
              -1
            </Button>
          </div>
        </div>
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
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Estatísticas</h2>
          <div className="space-y-3">
            {players.map((player, index) => {
              const playerNumber = (index + 1).toString().padStart(2, '0');
              const hasGoals = player.goals > 0;
              const hasAssists = player.assists > 0;
              const hasCards = player.yellowCards > 0 || player.redCards > 0;
              
              return (
                <div key={player.id} className="text-white">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">{playerNumber}. {player.name}</span>
                    <div className="flex items-center gap-4 text-sm">
                      {hasGoals && <span>Gols {player.goals}</span>}
                      {hasAssists && <span>Assistências {player.assists}</span>}
                      {hasCards && <span>Cartões {player.yellowCards + player.redCards}</span>}
                      {!hasGoals && !hasAssists && !hasCards && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'goals', true)} className="text-white hover:bg-white/10">
                            + Gol
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => updatePlayerStat(player.id, 'assists', true)} className="text-white hover:bg-white/10">
                            + Assist
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botão Salvar */}
      <div className="text-center">
        <Button 
          onClick={handleSave} 
          className="bg-[#F35410] hover:bg-[#BA2D0B] text-white w-full py-4 text-lg font-medium rounded-2xl"
        >
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default ScoreRecorder;