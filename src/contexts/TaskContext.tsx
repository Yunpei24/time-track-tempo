
import React, { createContext, useContext } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { TaskContextProps, Task, Project, TaskPriority, TaskStatus } from "@/types/taskTypes";

// Create context
const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    tasks, 
    isLoading, 
    addTask, 
    updateTask, 
    deleteTask, 
    addTimeToTask, 
    getUserTasks, 
    getProjectTasks,
    getTaskById 
  } = useTasks();
  
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    getProjectById 
  } = useProjects();

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

// Re-export types for easier access by consumers
export type { Task, Project, TaskPriority, TaskStatus };
