
import React from "react";
import { useTask } from "@/contexts/TaskContext";
import { Progress } from "@/components/ui/progress";

interface ProjectTimeDistributionProps {
  userId: string;
}

const ProjectTimeDistribution: React.FC<ProjectTimeDistributionProps> = ({ userId }) => {
  const { tasks, projects } = useTask();

  // Get user tasks
  const userTasks = tasks.filter((task) => task.assignedTo.includes(userId));

  // Calculate time statistics
  const totalTimeSpent = userTasks.reduce((sum, task) => sum + task.timeSpent, 0);

  // Calculate project stats
  const projectStats = projects.map((project) => {
    const projectTasks = userTasks.filter((task) => task.projectId === project.id);
    const timeSpent = projectTasks.reduce((sum, task) => sum + task.timeSpent, 0);
    return {
      id: project.id,
      name: project.name,
      color: project.color,
      timeSpent
    };
  }).sort((a, b) => b.timeSpent - a.timeSpent);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : "0h";
  };

  return (
    <div className="space-y-4">
      {projectStats.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun temps suivi sur les projets.</p>
      ) : (
        projectStats.map((project) => (
          <div key={project.id}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: project.color }}
                ></div>
                <span className="text-sm font-medium">{project.name}</span>
              </div>
              <span className="text-sm">{formatTime(project.timeSpent)}</span>
            </div>
            <Progress 
              value={totalTimeSpent > 0 ? (project.timeSpent / totalTimeSpent) * 100 : 0} 
              className="h-2"
              style={{ backgroundColor: project.color + "33" }}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectTimeDistribution;
