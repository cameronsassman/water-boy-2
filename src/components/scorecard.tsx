'use client';

import React, { useState, useEffect } from 'react';
import { Team, Player, Game, GameEvent } from '@/types';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  Minus, 
  Target, 
  AlertTriangle, 
  Square, 
  SquareX,
  Clock,
  Trophy,
  RotateCcw
} from 'lucide-react';

interface ScorecardProps {
  team1: Team;
  team2: Team;
  onGameComplete: (game: Game) => void;
  onGameUpdate?: (game: Game) => void;
}

export const Scorecard: React.FC<ScorecardProps> = ({
  team1,
  team2,
  onGameComplete,
  onGameUpdate,
}) => {
  const [game, setGame] = useState<Game>({
    id: Date.now().toString(),
    team1Id: team1.id,
    team2Id: team2.id,
    team1Score: 0,
    team2Score: 0,
    events: [],
    completed: false,
    createdAt: Date.now(),
  });

  const [currentHalf, setCurrentHalf] = useState<1 | 2>(1);
  const [team1Players, setTeam1Players] = useState<Player[]>(team1.players);
  const [team2Players, setTeam2Players] = useState<Player[]>(team2.players);

  // Update game when events change
  useEffect(() => {
    const team1Goals = game.events.filter(
      event => event.teamId === team1.id && event.type === 'goal'
    ).length;
    
    const team2Goals = game.events.filter(
      event => event.teamId === team2.id && event.type === 'goal'
    ).length;

    const updatedGame = {
      ...game,
      team1Score: team1Goals,
      team2Score: team2Goals,
    };

    setGame(updatedGame);
    
    if (onGameUpdate && !updatedGame.completed) {
      onGameUpdate(updatedGame);
    }
  }, [game.events]);

  const addEvent = (playerId: string, teamId: string, type: GameEvent['type']) => {
    const newEvent: GameEvent = {
      id: Date.now().toString(),
      playerId,
      teamId,
      type,
      half: currentHalf,
      timestamp: Date.now(),
    };

    setGame(prev => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));

    // Update player stats
    if (teamId === team1.id) {
      setTeam1Players(prev =>
        prev.map(player =>
          player.capNumber.toString() === playerId
            ? {
                ...player,
                goals: type === 'goal' ? player.goals + 1 : player.goals,
                kickOuts: type === 'kickOut' ? player.kickOuts + 1 : player.kickOuts,
                yellowCards: type === 'yellowCard' ? player.yellowCards + 1 : player.yellowCards,
                redCards: type === 'redCard' ? player.redCards + 1 : player.redCards,
              }
            : player
        )
      );
    } else {
      setTeam2Players(prev =>
        prev.map(player =>
          player.capNumber.toString() === playerId
            ? {
                ...player,
                goals: type === 'goal' ? player.goals + 1 : player.goals,
                kickOuts: type === 'kickOut' ? player.kickOuts + 1 : player.kickOuts,
                yellowCards: type === 'yellowCard' ? player.yellowCards + 1 : player.yellowCards,
                redCards: type === 'redCard' ? player.redCards + 1 : player.redCards,
              }
            : player
        )
      );
    }
  };

  const removeLastEvent = (playerId: string, teamId: string, type: GameEvent['type']) => {
    const eventIndex = [...game.events]
      .reverse()
      .findIndex(event => 
        event.playerId === playerId && 
        event.teamId === teamId && 
        event.type === type
      );

    if (eventIndex !== -1) {
      const actualIndex = game.events.length - 1 - eventIndex;
      
      setGame(prev => ({
        ...prev,
        events: prev.events.filter((_, index) => index !== actualIndex),
      }));

      // Update player stats
      if (teamId === team1.id) {
        setTeam1Players(prev =>
          prev.map(player =>
            player.capNumber.toString() === playerId
              ? {
                  ...player,
                  goals: type === 'goal' ? Math.max(0, player.goals - 1) : player.goals,
                  kickOuts: type === 'kickOut' ? Math.max(0, player.kickOuts - 1) : player.kickOuts,
                  yellowCards: type === 'yellowCard' ? Math.max(0, player.yellowCards - 1) : player.yellowCards,
                  redCards: type === 'redCard' ? Math.max(0, player.redCards - 1) : player.redCards,
                }
              : player
          )
        );
      } else {
        setTeam2Players(prev =>
          prev.map(player =>
            player.capNumber.toString() === playerId
              ? {
                  ...player,
                  goals: type === 'goal' ? Math.max(0, player.goals - 1) : player.goals,
                  kickOuts: type === 'kickOut' ? Math.max(0, player.kickOuts - 1) : player.kickOuts,
                  yellowCards: type === 'yellowCard' ? Math.max(0, player.yellowCards - 1) : player.yellowCards,
                  redCards: type === 'redCard' ? Math.max(0, player.redCards - 1) : player.redCards,
                }
              : player
          )
        );
      }
    }
  };

  const switchHalf = () => {
    setCurrentHalf(currentHalf === 1 ? 2 : 1);
  };

  const completeGame = () => {
    const finalGame = {
      ...game,
      completed: true,
    };
    
    setGame(finalGame);
    onGameComplete(finalGame);
  };

  const resetGame = () => {
    setGame({
      id: Date.now().toString(),
      team1Id: team1.id,
      team2Id: team2.id,
      team1Score: 0,
      team2Score: 0,
      events: [],
      completed: false,
      createdAt: Date.now(),
    });
    
    setCurrentHalf(1);
    setTeam1Players(team1.players);
    setTeam2Players(team2.players);
  };

  const PlayerRow: React.FC<{
    player: Player;
    teamId: string;
    isActive: boolean;
  }> = ({ player, teamId, isActive }) => {
    if (!player.name.trim()) return null;

    return (
      <div className={`player-row ${!isActive ? 'opacity-50' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className="cap-number-badge">
            {player.capNumber}
          </div>
          <span className="font-medium text-sm">{player.name}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Goals */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => removeLastEvent(player.capNumber.toString(), teamId, 'goal')}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              disabled={player.goals === 0}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="stat-button stat-button-goal min-w-[2rem] text-center">
              {player.goals}
            </span>
            <button
              onClick={() => addEvent(player.capNumber.toString(), teamId, 'goal')}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          {/* Kick-outs */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => removeLastEvent(player.capNumber.toString(), teamId, 'kickOut')}
              className="p-1 text-orange-600 hover:bg-orange-50 rounded"
              disabled={player.kickOuts === 0}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="stat-button stat-button-kickout min-w-[2rem] text-center">
              {player.kickOuts}
            </span>
            <button
              onClick={() => addEvent(player.capNumber.toString(), teamId, 'kickOut')}
              className="p-1 text-orange-600 hover:bg-orange-50 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          {/* Yellow Cards */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => removeLastEvent(player.capNumber.toString(), teamId, 'yellowCard')}
              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
              disabled={player.yellowCards === 0}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="stat-button stat-button-yellow min-w-[2rem] text-center">
              {player.yellowCards}
            </span>
            <button
              onClick={() => addEvent(player.capNumber.toString(), teamId, 'yellowCard')}
              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          {/* Red Cards */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => removeLastEvent(player.capNumber.toString(), teamId, 'redCard')}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              disabled={player.redCards === 0}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="stat-button stat-button-red min-w-[2rem] text-center">
              {player.redCards}
            </span>
            <button
              onClick={() => addEvent(player.capNumber.toString(), teamId, 'redCard')}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="scorecard-grid">
          {/* Team 1 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-600">{team1.schoolName}</h2>
            <div className="text-6xl font-bold text-gray-900 mt-2">{game.team1Score}</div>
          </div>
          
          {/* Center Controls */}
          <div className="text-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">
              <Clock className="inline w-5 h-5 mr-2" />
              Half {currentHalf}
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={switchHalf}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                Switch to Half {currentHalf === 1 ? 2 : 1}
              </Button>
              
              {!game.completed ? (
                <Button 
                  onClick={completeGame}
                  className="w-full"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Complete Game
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="text-green-600 font-semibold text-sm">
                    ✓ Game Completed
                  </div>
                  <Button 
                    onClick={resetGame}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Game
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Team 2 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">{team2.schoolName}</h2>
            <div className="text-6xl font-bold text-gray-900 mt-2">{game.team2Score}</div>
          </div>
        </div>
      </div>

      {/* Stats Legend */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Statistics Legend:</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4 text-green-600" />
            <span>Goals</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span>Kick-outs</span>
          </div>
          <div className="flex items-center space-x-1">
            <Square className="w-4 h-4 text-yellow-600" />
            <span>Yellow Cards</span>
          </div>
          <div className="flex items-center space-x-1">
            <SquareX className="w-4 h-4 text-red-600" />
            <span>Red Cards</span>
          </div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="scorecard-grid gap-6">
        {/* Team 1 Players */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">
            {team1.schoolName} Players
          </h3>
          <div className="space-y-1">
            {team1Players
              .filter(player => player.name.trim() !== '')
              .map((player) => (
                <PlayerRow
                  key={player.capNumber}
                  player={player}
                  teamId={team1.id}
                  isActive={player.redCards === 0}
                />
              ))}
          </div>
        </div>

        {/* Events Log */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Game Events</h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {game.events.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">No events recorded yet</p>
            ) : (
              [...game.events].reverse().map((event, index) => {
                const team = event.teamId === team1.id ? team1 : team2;
                const player = (event.teamId === team1.id ? team1Players : team2Players)
                  .find(p => p.capNumber.toString() === event.playerId);
                
                const eventIcons = {
                  goal: <Target className="w-4 h-4 text-green-600" />,
                  kickOut: <AlertTriangle className="w-4 h-4 text-orange-600" />,
                  yellowCard: <Square className="w-4 h-4 text-yellow-600" />,
                  redCard: <SquareX className="w-4 h-4 text-red-600" />,
                };
                
                const eventLabels = {
                  goal: 'Goal',
                  kickOut: 'Kick-out',
                  yellowCard: 'Yellow Card',
                  redCard: 'Red Card',
                };

                return (
                  <div key={`${event.id}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center space-x-2">
                      {eventIcons[event.type]}
                      <span className="font-medium">{eventLabels[event.type]}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{team.schoolName}</div>
                      <div className="text-gray-600">
                        #{event.playerId} {player?.name} • H{event.half}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Team 2 Players */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-red-600 mb-4 text-center">
            {team2.schoolName} Players
          </h3>
          <div className="space-y-1">
            {team2Players
              .filter(player => player.name.trim() !== '')
              .map((player) => (
                <PlayerRow
                  key={player.capNumber}
                  player={player}
                  teamId={team2.id}
                  isActive={player.redCards === 0}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};