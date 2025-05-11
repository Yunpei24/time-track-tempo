
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { UserPlus, Mail, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock members for demonstration
const mockMembers = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean@example.com",
    role: "manager",
    joinedAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie@example.com",
    role: "member",
    joinedAt: "2023-02-20",
  },
  {
    id: "3",
    name: "Pierre Dubois",
    email: "pierre@example.com",
    role: "member",
    joinedAt: "2023-03-10",
  },
];

const Members: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  if (!user) {
    navigate("/");
    return null;
  }
  
  const isManager = user.role === "manager";
  
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
              
              {isManager && (
                <Button onClick={() => setInviteModalOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inviter un membre
                </Button>
              )}
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Membres actifs</CardTitle>
                <CardDescription>
                  {mockMembers.length} membres dans cet espace de travail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMembers.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-white border rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={member.role === "manager" ? "default" : "outline"}>
                          {member.role === "manager" ? "Manager" : "Membre"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Members;
