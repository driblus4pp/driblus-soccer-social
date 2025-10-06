import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuickMatch, PlayerStats } from '@/types/quickMatch';
import { useToast } from '@/hooks/use-toast';

export const useQuickMatches = () => {
  const [matches, setMatches] = useState<QuickMatch[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadQuickMatches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quick_matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMatches: QuickMatch[] = data?.map(match => ({
        id: match.id,
        userId: match.user_id,
        type: match.type as 'team_sort' | 'score_record',
        teamA: match.team_a as any,
        teamB: match.team_b as any,
        players: match.players as any,
        duration: match.duration,
        location: match.location,
        notes: match.notes,
        createdAt: new Date(match.created_at),
        updatedAt: new Date(match.updated_at)
      })) || [];

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error loading quick matches:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as partidas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveQuickMatch = async (matchData: Omit<QuickMatch, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Get current user ID from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('quick_matches')
        .insert({
          user_id: user.id,
          type: matchData.type,
          team_a: matchData.teamA as any,
          team_b: matchData.teamB as any,
          players: matchData.players as any,
          duration: matchData.duration,
          location: matchData.location,
          notes: matchData.notes
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Partida salva com sucesso!",
        variant: "default"
      });

      // Reload matches to include the new one
      await loadQuickMatches();
    } catch (error) {
      console.error('Error saving quick match:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a partida.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlayerStats = (playerId: string): PlayerStats | undefined => {
    const playerMatches = matches.filter(match => 
      match.players.some(player => player.id === playerId)
    );

    if (playerMatches.length === 0) return undefined;

    const stats: PlayerStats = {
      playerId,
      playerName: '',
      totalMatches: playerMatches.length,
      totalGoals: 0,
      totalAssists: 0,
      totalYellowCards: 0,
      totalRedCards: 0,
      wins: 0,
      losses: 0,
      draws: 0
    };

    playerMatches.forEach(match => {
      const player = match.players.find(p => p.id === playerId);
      if (player) {
        stats.playerName = player.name;
        stats.totalGoals += player.goals;
        stats.totalAssists += player.assists;
        stats.totalYellowCards += player.yellowCards;
        stats.totalRedCards += player.redCards;

        // Calculate wins/losses based on team scores
        if (match.teamA.score > match.teamB.score) {
          if (player.team === 'A') stats.wins++;
          else stats.losses++;
        } else if (match.teamB.score > match.teamA.score) {
          if (player.team === 'B') stats.wins++;
          else stats.losses++;
        } else {
          stats.draws++;
        }
      }
    });

    return stats;
  };

  const getRecentMatches = (limit: number = 5): QuickMatch[] => {
    return matches.slice(0, limit);
  };

  useEffect(() => {
    loadQuickMatches();
  }, []);

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