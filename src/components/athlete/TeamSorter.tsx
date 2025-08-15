import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shuffle, Plus, Minus } from "lucide-react";
import { Player, Team } from '@/types/athlete';
interface TeamSorterProps {
  onBack: () => void;
}
const TeamSorter = ({
  onBack
}: TeamSorterProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPosition, setNewPlayerPosition] = useState('Jogador');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        skill: 7,
        position: newPlayerPosition
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
      setNewPlayerPosition('Jogador');
    }
  };
  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };
  const updatePlayerSkill = (id: string, skill: number) => {
    setPlayers(players.map(p => p.id === id ? {
      ...p,
      skill: Math.max(1, Math.min(10, skill))
    } : p));
  };
  const sortTeams = async () => {
    if (players.length < 2) return;
    setIsAnimating(true);

    // Simular animação de sorteio
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Algoritmo simples de balanceamento
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    
    // Se mais de 30 jogadores, dividir em 3 times
    if (players.length > 30) {
      const teamSize = Math.ceil(shuffled.length / 3);
      const teamA: Team = {
        name: 'Time A',
        players: shuffled.slice(0, teamSize).map(p => `${p.name} (${p.position})`),
        score: 0,
        color: '#F35410'
      };
      const teamB: Team = {
        name: 'Time B',
        players: shuffled.slice(teamSize, teamSize * 2).map(p => `${p.name} (${p.position})`),
        score: 0,
        color: '#FDB600'
      };
      const teamC: Team = {
        name: 'Time C',
        players: shuffled.slice(teamSize * 2).map(p => `${p.name} (${p.position})`),
        score: 0,
        color: '#10B981'
      };
      setTeams([teamA, teamB, teamC]);
    } else {
      // Dividir em 2 times
      const teamSize = Math.ceil(shuffled.length / 2);
      const teamA: Team = {
        name: 'Time A',
        players: shuffled.slice(0, teamSize).map(p => `${p.name} (${p.position})`),
        score: 0,
        color: '#F35410'
      };
      const teamB: Team = {
        name: 'Time B',
        players: shuffled.slice(teamSize).map(p => `${p.name} (${p.position})`),
        score: 0,
        color: '#FDB600'
      };
      setTeams([teamA, teamB]);
    }
    setIsAnimating(false);
  };
  const getSkillColor = (skill: number) => {
    if (skill >= 9) return 'bg-red-500 text-white';
    if (skill >= 7) return 'bg-orange-500 text-white';
    if (skill >= 5) return 'bg-yellow-500 text-black';
    return 'bg-gray-500 text-white';
  };
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-base text-slate-50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-50">Sorteador de Times </h1>
      </div>

      {/* Adicionar Jogadores */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Jogadores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input 
                placeholder="Nome do jogador" 
                value={newPlayerName} 
                onChange={e => setNewPlayerName(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && addPlayer()} 
                className="flex-1"
              />
              <select 
                value={newPlayerPosition}
                onChange={e => setNewPlayerPosition(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-black min-w-[120px]"
              >
                <option value="Jogador">Jogador</option>
                <option value="Goleiro">Goleiro</option>
                <option value="Defesa">Defesa</option>
                <option value="Meio-campo">Meio-campo</option>
                <option value="Atacante">Atacante</option>
              </select>
              <Button onClick={addPlayer}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {players.map(player => (
              <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="font-semibold text-black">{player.name}</span>
                  <span className="text-sm text-gray-500 ml-2">{player.position}</span>
                </div>
                
                <Button size="sm" variant="ghost" onClick={() => removePlayer(player.id)}>
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botão de Sortear */}
      <div className="text-center">
        <Button onClick={sortTeams} disabled={players.length < 2 || isAnimating} className="bg-[#F35410] hover:bg-[#BA2D0B] text-white px-8 py-4 text-lg">
          <Shuffle className={`w-5 h-5 mr-2 ${isAnimating ? 'animate-spin' : ''}`} />
          {isAnimating ? 'Sorteando...' : 'Sortear Times!'}
        </Button>
      </div>

      {/* Resultado do Sorteio */}
      {teams.length > 0 && (
        <div className={`grid gap-6 ${teams.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
          {teams.map((team, index) => {
            const getTeamColor = () => {
              if (team.color === '#F35410') return 'border-orange-300 bg-orange-50';
              if (team.color === '#FDB600') return 'border-yellow-300 bg-yellow-50';
              if (team.color === '#10B981') return 'border-green-300 bg-green-50';
              return 'border-blue-300 bg-blue-50';
            };
            
            const getTextColor = () => {
              if (team.color === '#F35410') return 'text-orange-700';
              if (team.color === '#FDB600') return 'text-yellow-700';
              if (team.color === '#10B981') return 'text-green-700';
              return 'text-blue-700';
            };

            return (
              <Card key={index} className={`border-2 ${getTeamColor()}`}>
                <CardHeader>
                  <CardTitle className={`text-center ${getTextColor()}`}>
                    {team.name} 🏆
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {team.players.map((playerInfo, playerIndex) => (
                      <div key={playerIndex} className="p-2 bg-white rounded">
                        <span className="font-medium text-black">{playerInfo}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Badge style={{ backgroundColor: team.color }} className="text-white">
                      Total de jogadores: {team.players.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>;
};
export default TeamSorter;