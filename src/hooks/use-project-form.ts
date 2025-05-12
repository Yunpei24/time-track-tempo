
import { useEffect, useState } from "react";
import { Project, useTask } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  startDate: string;
  endDate: string;
  members: string[];
}

export const useProjectForm = (project?: Project) => {
  const { user } = useAuth();
  const { addProject, updateProject } = useTask();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    color: "#3b82f6",
    startDate: "",
    endDate: "",
    members: [] // Initialize members as empty array
  });

  const isEdit = !!project;

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
        startDate: project.startDate,
        endDate: project.endDate,
        members: [] // Always set members as empty array
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
        members: [] // Always set members as empty array
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

  const handleSubmit = (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();

    if (!user) return;

    if (isEdit && project) {
      updateProject(project.id, {
        ...formData,
        members: [] // Ensure members is empty when updating
      });
    } else {
      addProject({
        ...formData,
        createdBy: user.id,
        members: [] // Ensure members is empty when creating
      });
    }

    onClose();
  };

  return {
    formData,
    isEdit,
    handleChange,
    handleColorSelect,
    handleSubmit
  };
};
