
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useAuth } from "@/contexts/AuthContext";
import { ClockIcon } from "lucide-react";

type AuthView = "login" | "register" | "forgot-password";

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [view, setView] = useState<AuthView>("login");

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <ClockIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-gray-900">
          TimeTrek
        </h2>
        <p className="mt-2 text-center text-gray-600 max-w">
          Gérez vos tâches et suivez votre temps efficacement
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 transition-all animate-scale-in">
          {view === "login" && (
            <LoginForm
              onShowRegister={() => setView("register")}
              onShowForgotPassword={() => setView("forgot-password")}
            />
          )}
          {view === "register" && (
            <RegisterForm onShowLogin={() => setView("login")} />
          )}
          {view === "forgot-password" && (
            <ForgotPasswordForm onShowLogin={() => setView("login")} />
          )}
        </Card>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>© 2023 TimeTrek. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Index;
