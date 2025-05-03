
import React, { useState, useEffect } from "react";
import { Task, useTask, TaskPriority, TaskStatus } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TaskFormProps {
  task?: Task;
  open: boolean;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, open, onClose }) => {
  const { user } = useAuth();
  const { projects, addTask, updateTask } = useTask();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "medium" as TaskPriority,
    status: "todo" as TaskStatus,
    dueDate: "",
    timeEstimate: 60, // Default 1 hour
  });

  const isEdit = !!task;

  // Set initial form data when editing an existing task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        timeEstimate: task.timeEstimate,
      });
    } else {
      // Reset form for new task
      setFormData({
        title: "",
        description: "",
        projectId: projects.length > 0 ? projects[0].id : "",
        priority: "medium",
        status: "todo",
        dueDate: new Date().toISOString().split("T")[0],
        timeEstimate: 60,
      });
    }
  }, [task, projects]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (isEdit && task) {
      updateTask(task.id, {
        ...formData,
        timeEstimate: Number(formData.timeEstimate),
      });
    } else {
      addTask({
        ...formData,
        userId: user.id,
        assignedTo: [user.id],
        timeEstimate: Number(formData.timeEstimate),
        timeSpent: 0,
      });
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier la tâche" : "Nouvelle tâche"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Entrez un titre pour la tâche"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez cette tâche en détail"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Projet</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) =>
                    handleSelectChange("projectId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleSelectChange("priority", value as TaskPriority)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value as TaskStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">À faire</SelectItem>
                      <SelectItem value="in-progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeEstimate">
                  Estimation de temps (minutes)
                </Label>
                <Input
                  id="timeEstimate"
                  name="timeEstimate"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.timeEstimate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {isEdit ? "Mettre à jour" : "Créer la tâche"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
