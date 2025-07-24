export interface Player {
    capNumber: number;
    name: string;
    goals: number;
    kickOuts: number;
    yellowCards: number;
    redCards: number;
  }
  
  export interface Team {
    id: string;
    schoolName: string;
    coaches: string[];
    managers: string[];
    players: Player[];
    stats: {
      wins: number;
      losses: number;
      draws: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
    };
  }
  
  export interface GameEvent {
    id: string;
    playerId: string;
    teamId: string;
    type: 'goal' | 'kickOut' | 'yellowCard' | 'redCard';
    half: 1 | 2;
    timestamp: number;
  }
  
  export interface Game {
    id: string;
    team1Id: string;
    team2Id: string;
    team1Score: number;
    team2Score: number;
    events: GameEvent[];
    completed: boolean;
    createdAt: number;
  }