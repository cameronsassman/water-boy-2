'use client';

import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Team, Game } from '@/types';
import { Scorecard } from '@/components/Scorecard';
import { Button } from '@/components/ui/Button';
import { FileText, Users, Trophy, ArrowLeft } from 'lucide-react';

export default function ScorecardPage() {
  const [teams] = useLocalStorage<Team[]>('waterPoloTeams', []);
  const [games, setGames] = useLocalStorage<Game[]>('waterPoloGames', []);
  const [selectedTeam1, setSelectedTeam1] = useState<Team | null>(null);
  const [selectedTeam2, setSelectedTeam2] = useState<Team | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  const handleGameComplete = (game: Game) => {
    setGames(prevGames => {
      const existingIndex = prevGames.findIndex(g => g.id === game.id);
      if (existingIndex >= 0) {
        const updated = [...prevGames];
        updated[existingIndex] = game;
        return updated;
      }
      return [...prevGames, game];
    });
    
    setCurrentGame(game);
  };

  const handleGameUpdate = (game: Game) => {
    setGames(prevGames => {
      const existingIndex = prevGames.findIndex(g => g.id === game.id);
      if (existingIndex >= 0) {
        const updated = [...prevGames];
        updated[existingIndex] = game;
        return updated;
      }
      return [...prevGames, game];
    });
  };

  const startNewGame = () => {
    setSelectedTeam1(null);
    setSelectedTeam2(null);
    setCurrentGame(null);
  };

  const availableTeams = teams.filter(team => 
    team.players.some(player => player.name.trim() !== '')
  );

  // Team Selection Phase
  if (!selectedTeam1 || !selectedTeam2) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Game Scorecard</h1>
          <p className="text-gray-600 mt-2">
            Select two teams to start tracking the game
          </p>
        </div>

        {availableTeams.length < 2 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Not enough teams registered
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You need at least 2 teams with players to start a game.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Team 1 Selection */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">
                Select Team 1
              </h2>
              {selectedTeam1 ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedTeam1.schoolName}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedTeam1.players.filter(p => p.name.trim() !== '').length} players
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedTeam1(null)}
                  >
                    Change Team
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableTeams
                    .filter(team => team.id !== selectedTeam2?.id)
                    .map((team) => (
                      <div
                        key={team.id}
                        onClick={() => setSelectedTeam1(team)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
                      >
                        <h3 className="font-semibold">{team.schoolName}</h3>
                        <p className="text-sm text-gray-600">
                          {team.players.filter(p => p.name.trim() !== '').length} players
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Team 2 Selection */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-red-600">
                Select Team 2
              </h2>
              {selectedTeam2 ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedTeam2.schoolName}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedTeam2.players.filter(p => p.name.trim() !== '').length} players
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedTeam2(null)}
                  >
                    Change Team
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableTeams
                    .filter(team => team.id !== selectedTeam1?.id)
                    .map((team) => (
                      <div
                        key={team.id}
                        onClick={() => setSelectedTeam2(team)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md cursor-pointer transition-all"
                      >
                        <h3 className="font-semibold">{team.schoolName}</h3>
                        <p className="text-sm text-gray-600">
                          {team.players.filter(p => p.name.trim() !== '').length} players
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Start Game Button */}
            {selectedTeam1 && selectedTeam2 && (
              <div className="text-center">
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-green-900">Ready to Start Game</h3>
                  <p className="text-green-700 text-sm">
                    {selectedTeam1.schoolName} vs {selectedTeam2.schoolName}
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Recent Games */}
        {games.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Games</h2>
            <div className="space-y-3">
              {games
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 5)
                .map((game) => {
                  const team1 = teams.find(t => t.id === game.team1Id);
                  const team2 = teams.find(t => t.id === game.team2Id);
                  
                  if (!team1 || !team2) return null;
                  
                  return (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {team1.schoolName} vs {team2.schoolName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(game.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {game.team1Score} - {game.team2Score}
                        </div>
                        <div className="text-xs text-gray-500">
                          {game.completed ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Game in Progress
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={startNewGame}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Team Selection
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedTeam1.schoolName} vs {selectedTeam2.schoolName}
          </h1>
          <p className="text-gray-600">Live Scorecard</p>
        </div>
        
        <div className="w-32"> {/* Spacer for layout balance */}
        </div>
      </div>

      <Scorecard
        team1={selectedTeam1}
        team2={selectedTeam2}
        onGameComplete={handleGameComplete}
        onGameUpdate={handleGameUpdate}
      />
    </div>
  );
}