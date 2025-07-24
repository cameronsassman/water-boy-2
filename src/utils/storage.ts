import { Team, Game } from '@/types';

export const STORAGE_KEYS = {
  TEAMS: 'waterPoloTeams',
  GAMES: 'waterPoloGames',
} as const;

export const getTeams = (): Team[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const teams = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return teams ? JSON.parse(teams) : [];
  } catch {
    return [];
  }
};

export const saveTeams = (teams: Team[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  } catch (error) {
    console.error('Error saving teams:', error);
  }
};

export const getGames = (): Game[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const games = localStorage.getItem(STORAGE_KEYS.GAMES);
    return games ? JSON.parse(games) : [];
  } catch {
    return [];
  }
};

export const saveGames = (games: Game[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  } catch (error) {
    console.error('Error saving games:', error);
  }
};