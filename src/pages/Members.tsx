
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import MembersList from "@/components/members/MembersList";
import AddMemberDialog from "@/components/members/AddMemberDialog";
import EmptyMembers from "@/components/members/EmptyMembers";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Users } from "lucide-react";

const Members: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    members, 
    isLoading, 
    isManager, 
    addMember, 
    updateMemberRole, 
    removeMember 
  } = useWorkspaceMembers();
  
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
              
              {isManager && (
                <div className="flex">
                  <AddMemberDialog onAddMember={addMember} />
                </div>
              )}
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-pulse text-gray-500">Chargement des membres...</div>
                  </div>
                ) : members.length === 0 ? (
                  <EmptyMembers />
                ) : (
                  <MembersList 
                    members={members}
                    currentUserId={user.id}
                    isManager={isManager}
                    onUpdateRole={updateMemberRole}
                    onRemoveMember={removeMember}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Members;
