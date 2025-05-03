
import React, { useState } from "react";
import { Task, useTask } from "@/contexts/TaskContext";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  PlayIcon,
  PauseIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useTimer } from "@/contexts/TimerContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { tasks, projects, updateTask, deleteTask } = useTask();
  const { startTimer, pauseTimer, resumeTimer, currentTaskId, isRunning, isPaused } = useTimer();
  
  const [filter, setFilter] = useState<{ status: string; projectId: string }>({
    status: "all",
    projectId: "all",
  });
  
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleStatusChange = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextStatus: Record<string, TaskStatus> = {
      todo: "in-progress",
      "in-progress": "completed",
      completed: "todo",
    };

    updateTask(taskId, { status: nextStatus[task.status] });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins ? ` ${mins}m` : ""}`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "À faire";
      case "in-progress":
        return "En cours";
      case "completed":
        return "Terminé";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  const handleTimerAction = (taskId: string) => {
    if (currentTaskId === taskId) {
      if (isPaused) {
        resumeTimer();
      } else {
        pauseTimer();
      }
    } else {
      startTimer(taskId);
    }
  };

  const confirmDelete = (taskId: string) => {
    setDeleteConfirm(taskId);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteTask(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter.status !== "all" && task.status !== filter.status) return false;
    if (filter.projectId !== "all" && task.projectId !== filter.projectId)
      return false;
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Mes tâches</h2>
        <div className="flex space-x-2">
          <Select 
            value={filter.projectId} 
            onValueChange={(value) => setFilter({ ...filter, projectId: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les projets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les projets</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={filter.status} 
            onValueChange={(value) => setFilter({ ...filter, status: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="todo">À faire</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            Aucune tâche ne correspond aux critères sélectionnés.
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const isTaskRunning = currentTaskId === task.id && isRunning && !isPaused;
            const isTaskPaused = currentTaskId === task.id && isPaused;
            const progressPercent = Math.min(
              100,
              task.timeEstimate > 0
                ? Math.round((task.timeSpent / task.timeEstimate) * 100)
                : 0
            );

            return (
              <Card
                key={task.id}
                className={`task-item overflow-hidden ${
                  task.status === "completed" ? "opacity-70" : ""
                }`}
              >
                <div className="p-4 flex flex-col md:flex-row md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 rounded-full p-0 mr-2"
                        onClick={() => handleStatusChange(task.id)}
                      >
                        <CheckIcon
                          className={`h-4 w-4 ${
                            task.status === "completed"
                              ? "text-green-500"
                              : "text-gray-300"
                          }`}
                        />
                      </Button>

                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-800">
                            {task.title}
                          </span>
                          <Badge
                            className={`ml-2 ${getStatusColor(task.status)}`}
                            variant="outline"
                          >
                            {getStatusLabel(task.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {project?.name}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {task.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        {task.priority === "high" && (
                          <Badge variant="destructive" className="mr-2">
                            <ArrowUpIcon className="h-3 w-3 mr-1" /> Haute
                          </Badge>
                        )}
                        {task.priority === "medium" && (
                          <Badge variant="secondary" className="mr-2">
                            <ArrowDownIcon className="h-3 w-3 mr-1" /> Moyenne
                          </Badge>
                        )}
                        {task.priority === "low" && (
                          <Badge variant="outline" className="mr-2">
                            <ArrowDownIcon className="h-3 w-3 mr-1" /> Basse
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500 ml-1">
                          Échéance: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {formatTime(task.timeSpent)} / {formatTime(task.timeEstimate)}
                      </div>
                    </div>

                    <div className="mt-2">
                      <Progress value={progressPercent} className="h-1.5" />
                    </div>
                  </div>

                  <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0 md:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`task-actions ${isTaskRunning ? "bg-blue-50" : isTaskPaused ? "bg-amber-50" : ""}`}
                      onClick={() => handleTimerAction(task.id)}
                    >
                      {isTaskRunning ? (
                        <PauseIcon className="h-4 w-4 text-blue-600" />
                      ) : isTaskPaused ? (
                        <PlayIcon className="h-4 w-4 text-amber-600" />
                      ) : (
                        <PlayIcon className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="task-actions"
                      onClick={() => onEditTask(task)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="task-actions text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => confirmDelete(task.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr de vouloir supprimer cette tâche ?</DialogTitle>
            <DialogDescription>
              Cette action ne peut pas être annulée. Toutes les données associées à cette tâche seront définitivement supprimées.
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

export default TaskList;
