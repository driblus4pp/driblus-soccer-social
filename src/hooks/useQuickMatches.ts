import { useState, useEffect } from 'react';
import { QuickMatch, QuickMatchPlayer, PlayerStats } from '@/types/quickMatch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useQuickMatches = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<QuickMatch[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar partidas do Supabase
  useEffect(() => {
    if (user) {
      loadQuickMatches();
    }
  }, [user]);

  const loadQuickMatches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quick_matches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      const formattedMatches: QuickMatch[] = (data || []).map(match => ({
        id: match.id,
        userId: match.user_id,
        type: match.type as 'team_sort' | 'score_record',
        teamA: match.team_a as any,
        teamB: match.team_b as any,
        players: (match.players as any) || [],
        createdAt: new Date(match.created_at),
        updatedAt: new Date(match.updated_at)
      }));

      setMatches(formattedMatches);
      updatePlayerStatsFromMatches(formattedMatches);
    } catch (error) {
      console.error('Erro ao carregar partidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuickMatch = async (match: Omit<QuickMatch, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quick_matches')
        .insert([{
          user_id: user.id,
          type: match.type,
          team_a: match.teamA as any,
          team_b: match.teamB as any,
          players: match.players as any
        }])
        .select()
        .single();

      if (error) throw error;

      const newMatch: QuickMatch = {
        id: data.id,
        userId: data.user_id,
        type: data.type as 'team_sort' | 'score_record',
        teamA: data.team_a as any,
        teamB: data.team_b as any,
        players: (data.players as any) || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      // Atualizar estado local
      await loadQuickMatches();
      
      toast({
        title: "Partida salva com sucesso!",
        description: "A partida foi registrada e as estatísticas dos jogadores foram atualizadas.",
      });

      return newMatch;
    } catch (error) {
      console.error('Erro ao salvar partida:', error);
      toast({
        title: "Erro ao salvar partida",
        description: "Ocorreu um erro ao salvar a partida. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const updatePlayerStatsFromMatches = (matches: QuickMatch[]) => {
    const statsMap = new Map<string, PlayerStats>();
    
    matches.forEach(match => {
      match.players.forEach(player => {
        const existingStats = statsMap.get(player.name);
        
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
          statsMap.set(player.name, newStats);
        }
      });
    });

    setPlayerStats(Array.from(statsMap.values()));
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
    getRecentMatches,
    loadQuickMatches
  };
};