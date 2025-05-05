import React from 'react';

// Définition des rôles possibles
type Role = 'Professeur' | 'Etudiant' | 'Admin';

// Props du composant
interface RoleBasedContentProps {
  role: Role; // Rôle de l'utilisateur
  allowedRoles: Role[]; // Liste des rôles autorisés
  children: React.ReactNode; // Contenu à afficher si le rôle est autorisé
}

const HassAccess: React.FC<RoleBasedContentProps> = ({ role, allowedRoles, children }) => {
  // Vérifier si le rôle de l'utilisateur est inclus dans la liste des rôles autorisés
  const isRoleAllowed = allowedRoles.includes(role);

  // Afficher le contenu si le rôle est autorisé, sinon retourner null
  return isRoleAllowed ? <>{children}</> : null;
};

export default HassAccess;