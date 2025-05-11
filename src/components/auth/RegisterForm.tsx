
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface RegisterFormProps {
  onShowLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onShowLogin }) => {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState("");
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    if (!workspaceName.trim()) {
      setError("Le nom de l'espace de travail est requis");
      return;
    }

    try {
      await register(name, email, password, workspaceName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="space-y-1 sm:space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Créer un compte</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          Inscrivez-vous pour commencer
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            type="text"
            placeholder="Jean Dupont"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nom@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="workspace">Nom de votre espace de travail</Label>
          <Input
            id="workspace"
            type="text"
            placeholder="Mon entreprise"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Cet espace vous permettra d'inviter des collaborateurs et de gérer vos projets.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Création du compte..." : "Créer un compte"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-500">Vous avez déjà un compte? </span>
        <button
          onClick={onShowLogin}
          className="text-blue-600 hover:underline"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
