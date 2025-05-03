
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./AuthContext";

// Types
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  userId: string;
  assignedTo: string[];
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  timeEstimate: number; // in minutes
  timeSpent: number; // in minutes
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  members: string[];
}

interface TaskContextProps {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTimeToTask: (taskId: string, minutes: number) => void;
  getUserTasks: (userId: string) => Task[];
  getProjectTasks: (projectId: string) => Task[];
  getTaskById: (id: string) => Task | undefined;
  getProjectById: (id: string) => Project | undefined;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Refonte du site web",
    description: "Amélioration du design et de l'expérience utilisateur",
    color: "#3b82f6",
    startDate: "2023-05-01",
    endDate: "2023-06-30",
    createdBy: "1",
    members: ["1", "2"]
  },
  {
    id: "2",
    name: "Application mobile",
    description: "Développement d'une application native iOS et Android",
    color: "#10b981",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    createdBy: "1",
    members: ["1", "2"]
  },
  {
    id: "3",
    name: "Campagne marketing",
    description: "Planification et exécution d'une campagne sur les réseaux sociaux",
    color: "#f59e0b",
    startDate: "2023-07-01",
    endDate: "2023-07-31",
    createdBy: "1",
    members: ["2"]
  }
];

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Maquettes homepage",
    description: "Créer des wireframes et des maquettes pour la nouvelle page d'accueil",
    projectId: "1",
    userId: "1",
    assignedTo: ["1"],
    priority: "high",
    status: "in-progress",
    dueDate: "2023-06-15",
    timeEstimate: 240, // 4 heures
    timeSpent: 125,
    createdAt: "2023-06-01"
  },
  {
    id: "2",
    title: "Implémenter l'authentification",
    description: "Configurer JWT pour l'application mobile",
    projectId: "2",
    userId: "1",
    assignedTo: ["1", "2"],
    priority: "medium",
    status: "todo",
    dueDate: "2023-06-20",
    timeEstimate: 180, // 3 heures
    timeSpent: 0,
    createdAt: "2023-06-05"
  },
  {
    id: "3",
    title: "Documentation API",
    description: "Documenter tous les endpoints API pour l'équipe backend",
    projectId: "1",
    userId: "2",
    assignedTo: ["2"],
    priority: "low",
    status: "todo",
    dueDate: "2023-06-25",
    timeEstimate: 120, // 2 heures
    timeSpent: 0,
    createdAt: "2023-06-10"
  },
  {
    id: "4",
    title: "Analyse concurrentielle",
    description: "Analyser les concurrents et préparer un rapport de synthèse",
    projectId: "3",
    userId: "2",
    assignedTo: ["2"],
    priority: "medium",
    status: "completed",
    dueDate: "2023-06-10",
    timeEstimate: 90, // 1.5 heures
    timeSpent: 90,
    createdAt: "2023-06-01"
  }
];

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load tasks and projects from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedProjects = localStorage.getItem("projects");
    
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      // Initial load of mock data
      localStorage.setItem("tasks", JSON.stringify(mockTasks));
    }
    
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      // Initial load of mock data
      localStorage.setItem("projects", JSON.stringify(mockProjects));
    }
  }, []);

  // Save tasks and projects to localStorage when they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    
    setTasks(prev => [...prev, newTask]);
    toast.success("Tâche ajoutée avec succès");
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedFields } : task
    ));
    toast.success("Tâche mise à jour");
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Tâche supprimée");
  };

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
    // Remove project
    setProjects(prev => prev.filter(project => project.id !== id));
    
    // Remove associated tasks
    setTasks(prev => prev.filter(task => task.projectId !== id));
    
    toast.success("Projet et tâches associées supprimés");
  };

  const addTimeToTask = (taskId: string, minutes: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, timeSpent: task.timeSpent + minutes } 
        : task
    ));
  };

  const getUserTasks = (userId: string) => {
    return tasks.filter(task => task.assignedTo.includes(userId));
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        addProject,
        updateProject,
        deleteProject,
        addTimeToTask,
        getUserTasks,
        getProjectTasks,
        getTaskById,
        getProjectById
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
