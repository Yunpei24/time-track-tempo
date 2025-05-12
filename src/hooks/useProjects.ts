
import { useState, useEffect } from "react";
import { Project } from "@/types/taskTypes";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Fetch projects from Supabase
  useEffect(() => {
    if (!user) return;
    
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
        
        if (error) {
          throw error;
        }
        
        // Transform data to match Project type
        const transformedProjects: Project[] = data.map((project: any) => ({
          id: project.id,
          name: project.name,
          description: project.description || "",
          color: project.color,
          startDate: project.startdate,
          endDate: project.enddate,
          createdBy: project.createdby,
          members: project.members || []
        }));
        
        setProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error("Erreur lors du chargement des projets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const addProject = async (project: Omit<Project, "id">) => {
    try {
      setIsLoading(true);
      
      // Transform project to match Supabase schema
      const supabaseProject = {
        name: project.name,
        description: project.description,
        color: project.color,
        startdate: project.startDate,
        enddate: project.endDate,
        createdby: project.createdBy,
        members: project.members
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert(supabaseProject)
        .select();
        
      if (error) throw error;
      
      // Transform returned data to match Project type
      if (data && data.length > 0) {
        const newProject: Project = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description || "",
          color: data[0].color,
          startDate: data[0].startdate,
          endDate: data[0].enddate,
          createdBy: data[0].createdby,
          members: data[0].members || []
        };
        
        setProjects(prev => [...prev, newProject]);
        toast.success("Projet ajouté avec succès");
      }
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error("Erreur lors de l'ajout du projet");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (id: string, updatedFields: Partial<Project>) => {
    try {
      setIsLoading(true);
      
      // Transform fields to match Supabase schema
      const supabaseFields: Record<string, any> = {};
      if ('name' in updatedFields) supabaseFields.name = updatedFields.name;
      if ('description' in updatedFields) supabaseFields.description = updatedFields.description;
      if ('color' in updatedFields) supabaseFields.color = updatedFields.color;
      if ('startDate' in updatedFields) supabaseFields.startdate = updatedFields.startDate;
      if ('endDate' in updatedFields) supabaseFields.enddate = updatedFields.endDate;
      if ('members' in updatedFields) supabaseFields.members = updatedFields.members;
      
      const { error } = await supabase
        .from('projects')
        .update(supabaseFields)
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...updatedFields } : project
      ));
      toast.success("Projet mis à jour");
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error("Erreur lors de la mise à jour du projet");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setProjects(prev => prev.filter(project => project.id !== id));
      toast.success("Projet supprimé");
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error("Erreur lors de la suppression du projet");
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return {
    projects,
    isLoading: isLoading,
    addProject,
    updateProject,
    deleteProject,
    getProjectById
  };
};
