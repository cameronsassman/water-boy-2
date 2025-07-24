import React from 'react';
import { Team } from '@/types';
import { Users } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  const playersWithNames = team.players.filter(p => p.name.trim() !== '');
  
  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{team.schoolName}</h3>
          
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              <strong>Coaches:</strong> {team.coaches.length > 0 ? team.coaches.join(', ') : 'None'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Managers:</strong> {team.managers.length > 0 ? team.managers.join(', ') : 'None'}
            </p>
          </div>
          
          <div className="mt-3 flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {playersWithNames.length}/14 players
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              Record: {team.stats.wins}W-{team.stats.losses}L-{team.stats.draws}D
            </div>
          </div>
        </div>
      </div>
      
      {playersWithNames.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {playersWithNames.slice(0, 6).map((player) => (
              <span
                key={player.capNumber}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                #{player.capNumber} {player.name}
              </span>
            ))}
            {playersWithNames.length > 6 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{playersWithNames.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};