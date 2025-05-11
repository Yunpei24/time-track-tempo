
import { Task, Project } from "@/types/taskTypes";

export const mockProjects: Project[] = [
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

export const mockTasks: Task[] = [
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
