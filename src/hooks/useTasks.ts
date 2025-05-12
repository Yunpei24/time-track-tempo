
import { useState, useEffect } from "react";
import { Task } from "@/types/taskTypes";
import { toast } from "@/components/ui/sonner";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      // Initialize with empty tasks array
      localStorage.setItem("tasks", JSON.stringify([]));
      setTasks([]);
    }
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    addTimeToTask,
    getUserTasks,
    getProjectTasks,
    getTaskById
  };
};
