
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface ForgotPasswordFormProps {
  onShowLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onShowLogin,
}) => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Réinitialisation du mot de passe</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success ? (
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            Si un compte existe avec cet email, vous recevrez bientôt un lien
            pour réinitialiser votre mot de passe.
          </div>
          <Button onClick={onShowLogin} variant="outline">
            Retour à la page de connexion
          </Button>
        </div>
      ) : (
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

          <div className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onShowLogin}
            >
              Retour à la connexion
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
