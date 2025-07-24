// src/components/RegistrationForm.tsx
'use client';

import React, { useState } from 'react';
import { Team, Player } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (team: Team) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    schoolName: '',
    coaches: [''],
    managers: [''],
    players: Array.from({ length: 14 }, (_, i): Player => ({
      capNumber: i + 1,
      name: '',
      goals: 0,
      kickOuts: 0,
      yellowCards: 0,
      redCards: 0,
    })),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }

    const validCoaches = formData.coaches.filter((coach) => coach.trim() !== '');
    if (validCoaches.length === 0) {
      newErrors.coaches = 'At least one coach is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newTeam: Team = {
      id: Date.now().toString(),
      schoolName: formData.schoolName.trim(),
      coaches: formData.coaches.filter((coach) => coach.trim() !== ''),
      managers: formData.managers.filter((manager) => manager.trim() !== ''),
      players: formData.players,
      stats: {
        wins: 0,
        losses: 0,
        draws: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
      },
    };

    onSubmit(newTeam);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      schoolName: '',
      coaches: [''],
      managers: [''],
      players: Array.from({ length: 14 }, (_, i): Player => ({
        capNumber: i + 1,
        name: '',
        goals: 0,
        kickOuts: 0,
        yellowCards: 0,
        redCards: 0,
      })),
    });
    setErrors({});
    onClose();
  };

  const addCoach = () => {
    setFormData((prev) => ({
      ...prev,
      coaches: [...prev.coaches, ''],
    }));
  };

  const removeCoach = (index: number) => {
    if (formData.coaches.length > 1) {
      setFormData((prev) => ({
        ...prev,
        coaches: prev.coaches.filter((_, i) => i !== index),
      }));
    }
  };

  const updateCoach = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      coaches: prev.coaches.map((coach, i) => (i === index ? value : coach)),
    }));
  };

  const addManager = () => {
    setFormData((prev) => ({
      ...prev,
      managers: [...prev.managers, ''],
    }));
  };

  const removeManager = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      managers: prev.managers.filter((_, i) => i !== index),
    }));
  };

  const updateManager = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      managers: prev.managers.map((manager, i) => (i === index ? value : manager)),
    }));
  };

  const updatePlayer = (index: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      players: prev.players.map((player, i) =>
        i === index ? { ...player, name } : player
      ),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register New Team</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* School Name */}
          <div>
            <Label htmlFor="schoolName">School Name *</Label>
            <Input
              id="schoolName"
              value={formData.schoolName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, schoolName: e.target.value }))
              }
              placeholder="Enter school name"
            />
            {errors.schoolName && (
              <p className="text-sm text-red-600 mt-1">{errors.schoolName}</p>
            )}
          </div>

          {/* Coaches */}
          <div>
            <Label>Coaches *</Label>
            {formData.coaches.map((coach, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={coach}
                  onChange={(e) => updateCoach(index, e.target.value)}
                  placeholder={`Coach ${index + 1} name`}
                  className="flex-1"
                />
                {formData.coaches.length > 1 && (
                  <Button variant="destructive" size="icon" onClick={() => removeCoach(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={addCoach} className="mt-2">
              <Plus className="w-4 h-4 mr-1" /> Add Coach
            </Button>
            {errors.coaches && (
              <p className="text-sm text-red-600 mt-1">{errors.coaches}</p>
            )}
          </div>

          {/* Managers */}
          <div>
            <Label>Managers</Label>
            {formData.managers.map((manager, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={manager}
                  onChange={(e) => updateManager(index, e.target.value)}
                  placeholder={`Manager ${index + 1} name`}
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeManager(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={addManager} className="mt-2">
              <Plus className="w-4 h-4 mr-1" /> Add Manager
            </Button>
          </div>

          {/* Players */}
          <div>
            <Label>Players (Cap Numbers 1-14)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
              {formData.players.map((player, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="cap-number-badge">{player.capNumber}</div>
                  <Input
                    value={player.name}
                    onChange={(e) => updatePlayer(index, e.target.value)}
                    placeholder="Player name"
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Register Team</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
