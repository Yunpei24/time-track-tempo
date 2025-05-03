
import React, { useState, useEffect } from "react";
import { Project, useTask } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectFormProps {
  project?: Project;
  open: boolean;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, open, onClose }) => {
  const { user } = useAuth();
  const { addProject, updateProject } = useTask();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    startDate: "",
    endDate: "",
    members: [] as string[]
  });

  const isEdit = !!project;

  const colorOptions = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#6366f1", // Indigo
    "#14b8a6", // Teal
  ];

  // Set initial form data when editing an existing project
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
        startDate: project.startDate,
        endDate: project.endDate,
        members: project.members
      });
    } else {
      // Reset form for new project
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      
      setFormData({
        name: "",
        description: "",
        color: "#3b82f6",
        startDate: today.toISOString().split("T")[0],
        endDate: nextMonth.toISOString().split("T")[0],
        members: user ? [user.id] : []
      });
    }
  }, [project, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (isEdit && project) {
      updateProject(project.id, formData);
    } else {
      addProject({
        ...formData,
        createdBy: user.id,
        members: [user.id]
      });
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le projet" : "Nouveau projet"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du projet</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez un nom pour le projet"
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
                placeholder="Décrivez ce projet en détail"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Couleur du projet</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color
                        ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    aria-label={`Couleur ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
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
              {isEdit ? "Mettre à jour" : "Créer le projet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
