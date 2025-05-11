
// Task and project related types
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "member" | "manager";
  workspaceId: string;
  avatarUrl?: string;
  createdAt: string;
}

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

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: "member" | "manager";
  joinedAt: string;
  avatarUrl?: string;
}

export interface TaskContextProps {
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
