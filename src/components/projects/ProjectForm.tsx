
import React from "react";
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
import { Project } from "@/contexts/TaskContext";
import { useProjectForm } from "@/hooks/use-project-form";
import ProjectColorPicker from "./ProjectColorPicker";
import ProjectDateInputs from "./ProjectDateInputs";

interface ProjectFormProps {
  project?: Project;
  open: boolean;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, open, onClose }) => {
  const { 
    formData, 
    isEdit, 
    handleChange, 
    handleColorSelect, 
    handleSubmit 
  } = useProjectForm(project);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le projet" : "Nouveau projet"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e, onClose)}>
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

            <ProjectColorPicker
              selectedColor={formData.color}
              onColorSelect={handleColorSelect}
            />

            <ProjectDateInputs
              startDate={formData.startDate}
              endDate={formData.endDate}
              onChange={handleChange}
            />
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
