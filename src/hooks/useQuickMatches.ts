// This hook is temporarily disabled due to missing table types
// Will be re-enabled once the database schema is properly synced

export const useQuickMatches = () => {
  const matches: any[] = [];
  const playerStats: any[] = [];
  const loading = false;

  const saveQuickMatch = async () => {
    console.log('Quick matches feature temporarily disabled');
  };

  const getPlayerStats = () => {
    return undefined;
  };

  const getRecentMatches = () => {
    return [];
  };

  const loadQuickMatches = async () => {
    console.log('Quick matches feature temporarily disabled');
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