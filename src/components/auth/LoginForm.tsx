
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { LogIn } from "lucide-react";

interface LoginFormProps {
  onShowRegister: () => void;
  onShowForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onShowRegister,
  onShowForgotPassword,
}) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      console.log("Tentative de connexion avec:", email);
      await login(email, password);
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Connexion</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Entrez vos identifiants pour vous connecter
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <button
              type="button"
              onClick={onShowForgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Mot de passe oublié?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Connexion...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Se connecter
            </span>
          )}
        </Button>
      </form>

      <div className="text-center">
        <span className="text-gray-500">Pas encore de compte? </span>
        <button
          type="button"
          onClick={onShowRegister}
          className="text-blue-600 hover:underline"
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
