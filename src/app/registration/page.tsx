'use client';

import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Team } from '@/types';
import { TeamCard } from '@/components/TeamCard';
import { RegistrationForm } from '@/components/RegistrationForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Users } from 'lucide-react';

export default function RegistrationPage() {
  const [teams, setTeams] = useLocalStorage<Team[]>('waterPoloTeams', []);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTeam = (newTeam: Team) => {
    setTeams(prevTeams => [...prevTeams, newTeam]);
  };

  const filteredTeams = teams.filter(team =>
    team.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.coaches.some(coach => coach.toLowerCase().includes(searchTerm.toLowerCase())) ||
    team.managers.some(manager => manager.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Registration</h1>
          <p className="text-gray-600 mt-2">
            Manage team registrations for the U14 Water Polo Tournament
          </p>
        </div>
        <Button onClick={() => setShowRegistrationForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Register New Team
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search teams, coaches, or managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{teams.length} teams registered</span>
            </div>
            <div>
              {teams.reduce((acc, team) => 
                acc + team.players.filter(p => p.name.trim() !== '').length, 0
              )} total players
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <>
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No teams match your search</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms or register a new team.
              </p>
            </>
          ) : (
            <>
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No teams registered</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by registering your first team.
              </p>
            </>
          )}
          <div className="mt-6">
            <Button onClick={() => setShowRegistrationForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Register Team
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      {/* Registration Form Modal */}
      <RegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        onSubmit={handleAddTeam}
      />
    </div>
  );
}