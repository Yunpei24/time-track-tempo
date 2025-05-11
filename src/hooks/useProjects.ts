
import { useState, useEffect } from "react";
import { Project } from "@/types/taskTypes";
import { mockProjects } from "@/data/mockData";
import { toast } from "@/components/ui/sonner";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from localStorage on mount
  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      // Initial load of mock data
      localStorage.setItem("projects", JSON.stringify(mockProjects));
      setProjects(mockProjects);
    }
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<Project, "id">) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString()
    };
    
    setProjects(prev => [...prev, newProject]);
    toast.success("Projet ajouté avec succès");
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updatedFields } : project
    ));
    toast.success("Projet mis à jour");
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    toast.success("Projet supprimé");
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById
  };
};
