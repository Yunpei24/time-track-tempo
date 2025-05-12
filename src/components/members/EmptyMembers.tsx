
import React from "react";
import { UsersRound } from "lucide-react";

const EmptyMembers: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <UsersRound className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">Aucun membre</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Votre espace de travail ne contient actuellement aucun membre. Ajoutez des membres pour commencer à collaborer avec votre équipe.
      </p>
    </div>
  );
};

export default EmptyMembers;
