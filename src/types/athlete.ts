
export interface AthleteProfile {
  id: string;
  userId: string;
  level: number;
  experience: number;
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  favoritePosition: string;
  athleteType: 'Iniciante' | 'Amador' | 'Semi-Pro' | 'Pro' | 'Lenda';
  badges: Badge[];
  achievements: Achievement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchRecord {
  id: string;
  userId: string;
  sportType: SportType;
  date: Date;
  venue: string;
  teamA: Team;
  teamB: Team;
  result: MatchResult;
  myTeam: 'A' | 'B';
  myStats: PlayerStats;
  photos?: string[];
  highlights?: string;
  rating: number;
  tags: string[];
}

export interface Team {
  name: string;
  players: string[];
  score: number;
  color: string;
}

export interface MatchResult {
  scoreA: number;
  scoreB: number;
  winner: 'A' | 'B' | 'draw';
  duration: number;
}

export interface PlayerStats {
  goals?: number;
  assists?: number;
  saves?: number;
  points?: number;
  rebounds?: number;
  blocks?: number;
  aces?: number;
  spikes?: number;
  sets?: number;
  games?: number;
  fouls: number;
  mvp: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: {
    experience: number;
    badge?: string;
    coins?: number;
  };
}

export interface TeamSorterResult {
  id: string;
  teams: Team[];
  balanceScore: number;
  players: Player[];
  createdAt: Date;
}

export interface Player {
  id: string;
  name: string;
  skill: number;
  position: string;
  avatar?: string;
  stats?: PlayerStats;
}

export enum SportType {
  FOOTBALL = 'football',
  FUTSAL = 'futsal',
  VOLLEYBALL = 'volleyball',
  BASKETBALL = 'basketball',
  TENNIS = 'tennis',
  PADEL = 'padel',
  BEACH_TENNIS = 'beach_tennis',
  FOOTVOLLEY = 'footvolley'
}
