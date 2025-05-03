
import React, { useState } from "react";
import { Project, useTask } from "@/contexts/TaskContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, EditIcon, TrashIcon, UsersIcon, ClockIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectListProps {
  onEditProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onEditProject }) => {
  const { user } = useAuth();
  const { projects, tasks, deleteProject } = useTask();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const isManager = user?.role === "manager";

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter((task) => task.projectId === projectId);
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter((task) => task.status === "completed").length;
    const totalTimeSpent = projectTasks.reduce((sum, task) => sum + task.timeSpent, 0);
    const totalTimeEstimate = projectTasks.reduce((sum, task) => sum + task.timeEstimate, 0);
    
    const percentComplete = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    const timeProgress = totalTimeEstimate > 0 
      ? Math.round((totalTimeSpent / totalTimeEstimate) * 100) 
      : 0;
    
    return {
      totalTasks,
      completedTasks,
      percentComplete,
      totalTimeSpent,
      totalTimeEstimate,
      timeProgress
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins ? ` ${mins}m` : ""}`;
  };

  const confirmDelete = (projectId: string) => {
    setDeleteConfirm(projectId);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteProject(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const stats = getProjectStats(project.id);
          
          return (
            <Card 
              key={project.id}
              className="project-card overflow-hidden"
              style={{ "--project-color": project.color } as React.CSSProperties}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  {isManager && (
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onEditProject(project)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => confirmDelete(project.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  {project.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <UsersIcon className="h-3 w-3 mr-1" />
                      {project.members.length} membres
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span>{stats.completedTasks}/{stats.totalTasks} tâches</span>
                    </div>
                    <Progress value={stats.percentComplete} className="h-1.5" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Temps</span>
                      <span className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {formatTime(stats.totalTimeSpent)} / {formatTime(stats.totalTimeEstimate)}
                      </span>
                    </div>
                    <Progress value={stats.timeProgress} className="h-1.5" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr de vouloir supprimer ce projet ?</DialogTitle>
            <DialogDescription>
              Cette action ne peut pas être annulée. Toutes les tâches associées à ce projet seront également supprimées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectList;
