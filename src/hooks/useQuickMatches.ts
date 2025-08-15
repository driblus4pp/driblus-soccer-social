import { useState, useEffect } from 'react';
import { QuickMatch, QuickMatchPlayer, PlayerStats } from '@/types/quickMatch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useQuickMatches = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<QuickMatch[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data para demonstração
  useEffect(() => {
    if (user) {
      setLoading(true);
      // Simular carregamento de dados
      setTimeout(() => {
        setMatches([]);
        setPlayerStats([]);
        setLoading(false);
      }, 500);
    }
  }, [user]);

  const saveQuickMatch = async (match: Omit<QuickMatch, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newMatch: QuickMatch = {
      ...match,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMatches(prev => [newMatch, ...prev]);
    updatePlayerStats(newMatch.players);
    
    toast({
      title: "Partida salva com sucesso!",
      description: "A partida foi registrada e as estatísticas dos jogadores foram atualizadas.",
    });

    return newMatch;
  };

  const updatePlayerStats = (players: QuickMatchPlayer[]) => {
    const updatedStats = [...playerStats];
    
    players.forEach(player => {
      const existingStats = updatedStats.find(s => s.playerName === player.name);
      
      if (existingStats) {
        existingStats.totalMatches += 1;
        existingStats.totalGoals += player.goals;
        existingStats.totalAssists += player.assists;
        existingStats.totalYellowCards += player.yellowCards;
        existingStats.totalRedCards += player.redCards;
      } else {
        const newStats: PlayerStats = {
          playerId: player.id,
          playerName: player.name,
          totalMatches: 1,
          totalGoals: player.goals,
          totalAssists: player.assists,
          totalYellowCards: player.yellowCards,
          totalRedCards: player.redCards,
          wins: 0,
          losses: 0,
          draws: 0
        };
        updatedStats.push(newStats);
      }
    });

    setPlayerStats(updatedStats);
  };

  const getPlayerStats = (playerName: string): PlayerStats | undefined => {
    return playerStats.find(stats => stats.playerName === playerName);
  };

  const getRecentMatches = (limit: number = 10): QuickMatch[] => {
    return matches.slice(0, limit);
  };

  return {
    matches,
    playerStats,
    loading,
    saveQuickMatch,
    getPlayerStats,
    getRecentMatches
  };
};