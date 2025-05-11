
import React from "react";
import { Label } from "@/components/ui/label";

interface ProjectColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ProjectColorPicker: React.FC<ProjectColorPickerProps> = ({
  selectedColor,
  onColorSelect
}) => {
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

  return (
    <div className="space-y-2">
      <Label>Couleur du projet</Label>
      <div className="flex flex-wrap gap-2">
        {colorOptions.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-8 h-8 rounded-full transition-all ${
              selectedColor === color
                ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            aria-label={`Couleur ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectColorPicker;
