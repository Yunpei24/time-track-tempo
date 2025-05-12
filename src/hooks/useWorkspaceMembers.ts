
import { useState, useEffect } from "react";
import { WorkspaceMember } from "@/types/taskTypes";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useWorkspaceMembers = () => {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Fetch workspace members
  useEffect(() => {
    if (!user?.workspaceName) return;
    
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('workspace_members')
          .select('*')
          .eq('workspace_id', user.workspaceName);
        
        if (error) {
          throw error;
        }
        
        // Transform data to match WorkspaceMember type
        const transformedMembers: WorkspaceMember[] = data.map((member: any) => ({
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role as "member" | "manager",
          joinedAt: member.joined_at,
          avatarUrl: member.avatar_url
        }));
        
        setMembers(transformedMembers);
      } catch (error) {
        console.error('Error fetching workspace members:', error);
        toast.error("Erreur lors du chargement des membres");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [user?.workspaceName]);

  // Add new member to workspace
  const addMember = async (member: Omit<WorkspaceMember, "id" | "joinedAt">) => {
    if (!user?.workspaceName) return;
    
    try {
      setIsLoading(true);
      
      const newMember = {
        workspace_id: user.workspaceName,
        user_id: member.id, // ID de l'utilisateur existant à ajouter
        name: member.name,
        email: member.email,
        role: member.role,
        avatar_url: member.avatarUrl
      };
      
      const { data, error } = await supabase
        .from('workspace_members')
        .insert(newMember)
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const addedMember: WorkspaceMember = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          role: data[0].role,
          joinedAt: data[0].joined_at,
          avatarUrl: data[0].avatar_url
        };
        
        setMembers(prev => [...prev, addedMember]);
        toast.success("Membre ajouté avec succès");
      }
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast.error(error.message || "Erreur lors de l'ajout du membre");
    } finally {
      setIsLoading(false);
    }
  };

  // Update member role
  const updateMemberRole = async (memberId: string, newRole: "member" | "manager") => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('workspace_members')
        .update({ role: newRole })
        .eq('id', memberId);
        
      if (error) throw error;
      
      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));
      
      toast.success("Rôle mis à jour avec succès");
    } catch (error: any) {
      console.error('Error updating member role:', error);
      toast.error("Erreur lors de la mise à jour du rôle");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove member from workspace
  const removeMember = async (memberId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      setMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success("Membre supprimé avec succès");
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error("Erreur lors de la suppression du membre");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is a workspace manager
  const isManager = user?.role === "manager";

  return {
    members,
    isLoading,
    isManager,
    addMember,
    updateMemberRole,
    removeMember
  };
};
