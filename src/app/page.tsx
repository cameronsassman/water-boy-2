'use client';

import React from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Team } from '@/types';
import { TeamCard } from '@/components/TeamCard';
import { Button } from '@/components/ui/Button';
import { Users, FileText, Trophy } from 'lucide-react';

export default function HomePage() {
  const [teams] = useLocalStorage<Team[]>('waterPoloTeams', []);

  const stats = {
    totalTeams: teams.length,
    totalPlayers: teams.reduce((acc, team) => 
      acc + team.players.filter(p => p.name.trim() !== '').length, 0
    ),
    totalGames: teams.reduce((acc, team) => 
      acc + team.stats.wins + team.stats.losses + team.stats.draws, 0
    ) / 2, // Divide by 2 since each game involves 2 teams
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to the U14 Water Polo Tournament
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage team registrations and track game scores with ease
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTeams}</p>
              <p className="text-sm text-gray-600">Registered Teams</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPlayers}</p>
              <p className="text-sm text-gray-600">Total Players</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalGames}</p>
              <p className="text-sm text-gray-600">Games Played</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/registration">
            <div className="border border-gray-200 p-4 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold">Team Registration</h3>
                  <p className="text-sm text-gray-600">Register new teams for the tournament</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/scorecard">
            <div className="border border-gray-200 p-4 rounded-lg hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="font-semibold">Game Scorecard</h3>
                  <p className="text-sm text-gray-600">Track scores and player statistics</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Teams */}
      {teams.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Recently Registered Teams</h2>
            <Link href="/registration">
              <Button variant="secondary" size="sm">
                View All Teams
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.slice(-6).map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No teams registered yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by registering your first team.</p>
          <div className="mt-6">
            <Link href="/registration">
              <Button>
                Register First Team
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
