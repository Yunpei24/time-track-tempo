
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectDateInputsProps {
  startDate: string;
  endDate: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProjectDateInputs: React.FC<ProjectDateInputsProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startDate">Date de début</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={startDate}
          onChange={onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">Date de fin</Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={endDate}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

export default ProjectDateInputs;
