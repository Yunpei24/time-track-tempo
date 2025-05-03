
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Reports: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tasks, projects, getUserTasks } = useTask();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [selectedProject, setSelectedProject] = useState<string>("all");

  if (!user) {
    navigate("/");
    return null;
  }

  // Prepare data for reports
  const userTasks = getUserTasks(user.id);
  
  // Filter tasks by selected project
  const filteredTasks = selectedProject === "all" 
    ? userTasks 
    : userTasks.filter(task => task.projectId === selectedProject);
  
  // Calculate time statistics
  const totalTimeSpent = filteredTasks.reduce((sum, task) => sum + task.timeSpent, 0);
  const completedTasks = filteredTasks.filter(task => task.status === "completed");
  const completedTasksCount = completedTasks.length;
  const completionRate = filteredTasks.length > 0 
    ? Math.round((completedTasksCount / filteredTasks.length) * 100) 
    : 0;
  
  // Status distribution for pie chart
  const statusDistribution = [
    {
      name: "À faire",
      value: filteredTasks.filter(task => task.status === "todo").length,
      color: "#94a3b8"
    },
    {
      name: "En cours",
      value: filteredTasks.filter(task => task.status === "in-progress").length,
      color: "#3b82f6"
    },
    {
      name: "Terminées",
      value: completedTasksCount,
      color: "#10b981"
    }
  ];
  
  // Time distribution by project for bar chart
  const timeByProject = projects.map(project => {
    const projectTasks = userTasks.filter(task => task.projectId === project.id);
    const timeSpent = projectTasks.reduce((sum, task) => sum + task.timeSpent, 0);
    return {
      name: project.name,
      hoursSpent: Math.round(timeSpent / 60 * 10) / 10, // Convert to hours with 1 decimal
      color: project.color
    };
  }).sort((a, b) => b.hoursSpent - a.hoursSpent);
  
  // Weekly productivity data (mock data for now)
  const weeklyData = [
    { day: "Lun", hours: 5.2 },
    { day: "Mar", hours: 6.8 },
    { day: "Mer", hours: 4.3 },
    { day: "Jeu", hours: 7.1 },
    { day: "Ven", hours: 5.9 },
    { day: "Sam", hours: 2.4 },
    { day: "Dim", hours: 1.0 },
  ];
  
  // Format time helpers
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins ? ` ${mins}m` : ""}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNewTask={() => navigate("/tasks")} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Rapports" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                Rapports et Analyses
              </h1>
              <div className="mt-3 sm:mt-0 flex space-x-2">
                <Select 
                  value={selectedProject} 
                  onValueChange={setSelectedProject}
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
                  value={timeRange} 
                  onValueChange={(value: "week" | "month" | "year") => setTimeRange(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Temps total suivi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatTime(totalTimeSpent)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalTimeSpent > 0
                      ? `Moyenne: ${formatTime(Math.round(totalTimeSpent / (filteredTasks.length || 1)))} par tâche`
                      : "Aucun temps suivi"}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tâches terminées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedTasksCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    sur {filteredTasks.length} tâches au total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taux d'achèvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completionRate}%</div>
                  <Progress value={completionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly productivity chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Productivité hebdomadaire</CardTitle>
                  <CardDescription>
                    Heures suivies par jour sur les 7 derniers jours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="hours" name="Heures" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Status distribution */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Répartition des tâches</CardTitle>
                  <CardDescription>
                    Distribution des tâches par statut
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Time by project chart */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Temps par projet</CardTitle>
                  <CardDescription>
                    Répartition du temps passé sur chaque projet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeByProject} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip formatter={(value) => [`${value} heures`, "Temps passé"]} />
                        <Bar dataKey="hoursSpent" name="Heures" radius={[0, 4, 4, 0]}>
                          {timeByProject.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
