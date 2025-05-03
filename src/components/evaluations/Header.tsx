import React from 'react';
import { Button } from '../common/Button';
import { UserRole } from '../../types/evaluations';

interface HeaderProps {
  userRole: UserRole;
  onRoleToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, onRoleToggle }) => {
  return (
    <header className="bg-blue-800 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Module d'Évaluations - Université</h1>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Rôle: {userRole}</span>
          <Button variant="secondary" size="sm" onClick={onRoleToggle}>
            Changer de rôle
          </Button>
        </div>
      </div>
    </header>
  );
};