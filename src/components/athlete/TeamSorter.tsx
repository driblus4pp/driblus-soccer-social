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
  const [players, setPlayers] = useState<Player[]>([{
    id: '1',
    name: 'João',
    skill: 8,
    position: 'Atacante'
  }, {
    id: '2',
    name: 'Pedro',
    skill: 7,
    position: 'Meio-campo'
  }, {
    id: '3',
    name: 'Lucas',
    skill: 9,
    position: 'Defesa'
  }, {
    id: '4',
    name: 'Carlos',
    skill: 6,
    position: 'Goleiro'
  }]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        skill: Math.floor(Math.random() * 5) + 5,
        // Skill entre 5-10
        position: 'Jogador'
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
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
    const teamSize = Math.ceil(shuffled.length / 2);
    const teamA: Team = {
      name: 'Time A',
      players: shuffled.slice(0, teamSize).map(p => p.name),
      score: 0,
      color: '#F35410'
    };
    const teamB: Team = {
      name: 'Time B',
      players: shuffled.slice(teamSize).map(p => p.name),
      score: 0,
      color: '#FDB600'
    };
    setTeams([teamA, teamB]);
    setIsAnimating(false);

    // TODO: Implementar salvamento da partida rápida no futuro
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
          <div className="flex gap-2">
            <Input placeholder="Nome do jogador" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} onKeyPress={e => e.key === 'Enter' && addPlayer()} />
            <Button onClick={addPlayer}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {players.map(player => <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="font-semibold">{player.name}</span>
                  <span className="text-sm text-gray-500 ml-2">{player.position}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Skill:</Label>
                  <Button size="sm" variant="ghost" onClick={() => updatePlayerSkill(player.id, player.skill - 1)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Badge className={getSkillColor(player.skill)}>
                    {player.skill}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => updatePlayerSkill(player.id, player.skill + 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <Button size="sm" variant="ghost" onClick={() => removePlayer(player.id)}>
                  <Minus className="w-4 h-4" />
                </Button>
              </div>)}
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
      {teams.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team, index) => <Card key={index} className={`border-2 ${index === 0 ? 'border-blue-300 bg-blue-50' : 'border-red-300 bg-red-50'}`}>
              <CardHeader>
                <CardTitle className={`text-center ${index === 0 ? 'text-blue-700' : 'text-red-700'}`}>
                  {team.name} 🏆
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {team.players.map((playerName, playerIndex) => <div key={playerIndex} className="p-2 bg-white rounded flex items-center justify-between">
                      <span className="font-medium">{playerName}</span>
                      <Badge variant="secondary">
                        Skill: {players.find(p => p.name === playerName)?.skill || 5}
                      </Badge>
                    </div>)}
                </div>
                
                <div className="mt-4 text-center">
                  <Badge className={index === 0 ? 'bg-blue-500' : 'bg-red-500'}>
                    Skill Total: {team.players.reduce((total, playerName) => total + (players.find(p => p.name === playerName)?.skill || 5), 0)}
                  </Badge>
                </div>
              </CardContent>
            </Card>)}
        </div>}
    </div>;
};
export default TeamSorter;