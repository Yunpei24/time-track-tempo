
import React from "react";
import { useTask } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckIcon, ClockIcon, ListIcon } from "lucide-react";

interface TaskStatisticsProps {
  userId: string;
}

const TaskStats: React.FC<TaskStatisticsProps> = ({ userId }) => {
  const { tasks, projects } = useTask();

  // Get user tasks
  const userTasks = tasks.filter((task) => task.assignedTo.includes(userId));

  // Calculate statistics
  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = userTasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const todoTasks = userTasks.filter(
    (task) => task.status === "todo"
  ).length;

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate time statistics
  const totalTimeSpent = userTasks.reduce((sum, task) => sum + task.timeSpent, 0);
  const totalTimeEstimate = userTasks.reduce(
    (sum, task) => sum + task.timeEstimate,
    0
  );

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tâches totales</CardTitle>
          <ListIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground">
            {todoTasks} à faire, {inProgressTasks} en cours, {completedTasks} terminées
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Achèvement</CardTitle>
          <CheckIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionPercentage}%</div>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Temps suivi</CardTitle>
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(totalTimeSpent)}</div>
          <p className="text-xs text-muted-foreground">
            sur {formatTime(totalTimeEstimate)} estimées
          </p>
        </CardContent>
      </Card>
      
      {/* Project time distribution - This will be rendered in the Dashboard component */}
      <div className="md:col-span-3 hidden">
        <Card>
          <CardHeader>
            <CardTitle>Répartition du temps par projet</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskStats;
