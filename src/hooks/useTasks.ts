
import { useState, useEffect } from "react";
import { Task } from "@/types/taskTypes";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Fetch tasks from Supabase
  useEffect(() => {
    if (!user) return;
    
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
        
        if (error) {
          throw error;
        }
        
        // Transform data to match Task type
        const transformedTasks: Task[] = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description || "",
          projectId: task.projectid || "",
          userId: task.userid,
          assignedTo: task.assignedto || [],
          priority: task.priority,
          status: task.status,
          dueDate: task.duedate || new Date().toISOString().split('T')[0],
          timeEstimate: task.timeestimate || 0,
          timeSpent: task.timespent || 0,
          createdAt: task.createdat.split('T')[0]
        }));
        
        setTasks(transformedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error("Erreur lors du chargement des tâches");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    try {
      setIsLoading(true);
      
      // Transform task to match Supabase schema
      const supabaseTask = {
        title: task.title,
        description: task.description,
        projectid: task.projectId,
        userid: task.userId,
        assignedto: task.assignedTo,
        priority: task.priority,
        status: task.status,
        duedate: task.dueDate,
        timeestimate: task.timeEstimate,
        timespent: task.timeSpent || 0
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(supabaseTask)
        .select();
        
      if (error) throw error;
      
      // Transform returned data to match Task type
      if (data && data.length > 0) {
        const newTask: Task = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description || "",
          projectId: data[0].projectid || "",
          userId: data[0].userid,
          assignedTo: data[0].assignedto || [],
          priority: data[0].priority,
          status: data[0].status,
          dueDate: data[0].duedate || new Date().toISOString().split('T')[0],
          timeEstimate: data[0].timeestimate || 0,
          timeSpent: data[0].timespent || 0,
          createdAt: data[0].createdat.split('T')[0]
        };
        
        setTasks(prev => [...prev, newTask]);
        toast.success("Tâche ajoutée avec succès");
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Erreur lors de l'ajout de la tâche");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    try {
      setIsLoading(true);
      
      // Transform fields to match Supabase schema
      const supabaseFields: Record<string, any> = {};
      if ('title' in updatedFields) supabaseFields.title = updatedFields.title;
      if ('description' in updatedFields) supabaseFields.description = updatedFields.description;
      if ('projectId' in updatedFields) supabaseFields.projectid = updatedFields.projectId;
      if ('assignedTo' in updatedFields) supabaseFields.assignedto = updatedFields.assignedTo;
      if ('priority' in updatedFields) supabaseFields.priority = updatedFields.priority;
      if ('status' in updatedFields) supabaseFields.status = updatedFields.status;
      if ('dueDate' in updatedFields) supabaseFields.duedate = updatedFields.dueDate;
      if ('timeEstimate' in updatedFields) supabaseFields.timeestimate = updatedFields.timeEstimate;
      if ('timeSpent' in updatedFields) supabaseFields.timespent = updatedFields.timeSpent;
      
      const { error } = await supabase
        .from('tasks')
        .update(supabaseFields)
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updatedFields } : task
      ));
      toast.success("Tâche mise à jour");
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error("Erreur lors de la mise à jour de la tâche");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success("Tâche supprimée");
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Erreur lors de la suppression de la tâche");
    } finally {
      setIsLoading(false);
    }
  };

  const addTimeToTask = async (taskId: string, minutes: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newTimeSpent = task.timeSpent + minutes;
      
      const { error } = await supabase
        .from('tasks')
        .update({ timespent: newTimeSpent })
        .eq('id', taskId);
        
      if (error) throw error;
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, timeSpent: newTimeSpent } 
          : task
      ));
    } catch (error) {
      console.error('Error adding time to task:', error);
      toast.error("Erreur lors de l'ajout du temps à la tâche");
    }
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
