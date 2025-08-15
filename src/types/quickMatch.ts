export interface QuickMatchPlayer {
  id: string;
  name: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  team: 'A' | 'B';
}

export interface QuickMatchTeam {
  id: 'A' | 'B';
  name: string;
  color: string;
  score: number;
  players: string[];
}

export interface QuickMatch {
  id: string;
  userId: string;
  type: 'team_sort' | 'score_record';
  teamA: QuickMatchTeam;
  teamB: QuickMatchTeam;
  players: QuickMatchPlayer[];
  duration?: number; // em minutos
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  totalMatches: number;
  totalGoals: number;
  totalAssists: number;
  totalYellowCards: number;
  totalRedCards: number;
  wins: number;
  losses: number;
  draws: number;
}