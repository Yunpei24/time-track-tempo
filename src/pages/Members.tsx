
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Members: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (!user) {
    navigate("/");
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-50 flex-col sm:flex-row">
      <Sidebar onNewTask={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Membres" />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Membres de l'espace
                </h1>
                <p className="text-gray-500">
                  Gérez les membres de votre espace de travail {user.workspaceName || ""}
                </p>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Fonctionnalité indisponible</CardTitle>
                <CardDescription>
                  La gestion des membres n'est pas disponible pour l'instant
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <UserCircle className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-center text-gray-500">
                  Cette fonctionnalité sera disponible ultérieurement.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Members;
