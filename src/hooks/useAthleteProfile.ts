
import { useState, useEffect } from 'react';
import { AthleteProfile, MatchRecord, Badge, Achievement } from '@/types/athlete';
import { useAuth } from '@/contexts/AuthContext';

export const useAthleteProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data para demonstração
  useEffect(() => {
    if (user) {
      // Simular carregamento do perfil
      const mockProfile: AthleteProfile = {
        id: '1',
        userId: user.id,
        level: 12,
        experience: 2450,
        totalMatches: 47,
        wins: 28,
        losses: 15,
        draws: 4,
        favoritePosition: 'Atacante',
        athleteType: 'Amador',
        badges: [
          {
            id: '1',
            name: 'Artilheiro',
            description: 'Marcou 10 gols em partidas registradas',
            icon: '⚽',
            color: '#F35410',
            rarity: 'rare',
            unlockedAt: new Date()
          },
          {
            id: '2',
            name: 'Fair Play',
            description: 'Jogou 20 partidas sem cartões',
            icon: '🤝',
            color: '#22C55E',
            rarity: 'common',
            unlockedAt: new Date()
          }
        ],
        achievements: [
          {
            id: '1',
            name: 'Centurião',
            description: 'Jogue 100 partidas',
            icon: '🏆',
            progress: 47,
            target: 100,
            completed: false,
            reward: { experience: 500, badge: 'centurion' }
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setProfile(mockProfile);
      setLoading(false);
    }
  }, [user]);

  const addMatchRecord = (match: Omit<MatchRecord, 'id'>) => {
    const newMatch: MatchRecord = {
      ...match,
      id: Date.now().toString()
    };
    setMatchHistory(prev => [newMatch, ...prev]);
    
    // Atualizar experiência e estatísticas
    updateExperience(50);
  };

  const updateExperience = (exp: number) => {
    if (!profile) return;
    
    const newExp = profile.experience + exp;
    const newLevel = Math.floor(newExp / 200) + 1;
    
    setProfile(prev => prev ? {
      ...prev,
      experience: newExp,
      level: newLevel > prev.level ? newLevel : prev.level
    } : null);
  };

  const getNextLevelExp = () => {
    if (!profile) return 0;
    return (profile.level * 200) - profile.experience;
  };

  const getWinRate = () => {
    if (!profile || profile.totalMatches === 0) return 0;
    return Math.round((profile.wins / profile.totalMatches) * 100);
  };

  return {
    profile,
    matchHistory,
    loading,
    addMatchRecord,
    updateExperience,
    getNextLevelExp,
    getWinRate
  };
};
