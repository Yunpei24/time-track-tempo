
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, DownloadIcon, MailIcon } from "lucide-react";
import TaskForm from "@/components/tasks/TaskForm";
import { toast } from "@/components/ui/sonner";

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { tasks, projects } = useTask();
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [period, setPeriod] = useState("this-week");
  const [projectFilter, setProjectFilter] = useState("all");

  if (!user) {
    navigate("/");
    return null;
  }

  const openNewTaskModal = () => {
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const downloadReport = () => {
    toast.success("Rapport téléchargé avec succès");
  };

  const sendReportByEmail = () => {
    toast.success("Rapport envoyé par email");
  };

  // Helper function to format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins ? ` ${mins}m` : ""}`;
  };

  // Filter tasks based on period and project
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Apply period filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6); // Sunday
    
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    switch (period) {
      case "today":
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= today && taskDate < new Date(today.getTime() + 86400000); // +1 day
        });
        break;
      case "this-week":
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= thisWeekStart && taskDate <= thisWeekEnd;
        });
        break;
      case "this-month":
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= thisMonthStart && taskDate <= thisMonthEnd;
        });
        break;
      default:
        break;
    }
    
    // Apply project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter(task => task.projectId === projectFilter);
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  
  // Calculate statistics
  const totalTime = filteredTasks.reduce((sum, task) => sum + task.timeSpent, 0);
  
  // Group by project
  const projectTimeData = projects.map(project => {
    const projectTasks = filteredTasks.filter(task => task.projectId === project.id);
    const projectTime = projectTasks.reduce((sum, task) => sum + task.timeSpent, 0);
    return {
      id: project.id,
      name: project.name,
      color: project.color,
      time: projectTime,
      percentage: totalTime > 0 ? (projectTime / totalTime) * 100 : 0
    };
  }).filter(project => project.time > 0).sort((a, b) => b.time - a.time);

  // Group by status
  const statusData = [
    {
      name: "À faire",
      time: filteredTasks.filter(task => task.status === "todo").reduce((sum, task) => sum + task.timeSpent, 0),
      color: "bg-gray-200"
    },
    {
      name: "En cours",
      time: filteredTasks.filter(task => task.status === "in-progress").reduce((sum, task) => sum + task.timeSpent, 0),
      color: "bg-blue-400"
    },
    {
      name: "Terminé",
      time: filteredTasks.filter(task => task.status === "completed").reduce((sum, task) => sum + task.timeSpent, 0),
      color: "bg-green-400"
    }
  ].filter(status => status.time > 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNewTask={openNewTaskModal} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Rapports" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Rapport d'activité
              </h1>
              
              <div className="flex flex-wrap mt-4 md:mt-0 gap-2">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="this-week">Cette semaine</SelectItem>
                    <SelectItem value="this-month">Ce mois</SelectItem>
                    <SelectItem value="all">Toute la période</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les projets</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={downloadReport}>
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={sendReportByEmail}>
                    <MailIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Temps par projet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-4">
                    {formatTime(totalTime)}
                  </div>
                  
                  <div className="space-y-4">
                    {projectTimeData.length > 0 ? (
                      projectTimeData.map(project => (
                        <div key={project.id}>
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{backgroundColor: project.color}}
                              ></div>
                              <span className="text-sm">{project.name}</span>
                            </div>
                            <span className="text-sm">{formatTime(project.time)}</span>
                          </div>
                          <Progress 
                            value={project.percentage} 
                            className="h-2" 
                            indicatorStyle={{backgroundColor: project.color}}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        Aucune donnée disponible pour cette période
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Temps par statut
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-4">
                    {formatTime(totalTime)}
                  </div>
                  
                  <div className="space-y-4">
                    {statusData.length > 0 ? (
                      statusData.map(status => (
                        <div key={status.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{status.name}</span>
                            <span className="text-sm">{formatTime(status.time)}</span>
                          </div>
                          <Progress 
                            value={totalTime > 0 ? (status.time / totalTime) * 100 : 0} 
                            className={`h-2 ${status.color}`} 
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        Aucune donnée disponible pour cette période
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Tâches récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Tâche</th>
                          <th className="text-left py-3 px-4 font-medium">Projet</th>
                          <th className="text-left py-3 px-4 font-medium">Statut</th>
                          <th className="text-left py-3 px-4 font-medium">Temps passé</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map(task => {
                            const project = projects.find(p => p.id === task.projectId);
                            return (
                              <tr key={task.id} className="border-b">
                                <td className="py-3 px-4">{task.title}</td>
                                <td className="py-3 px-4">{project?.name || "-"}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    task.status === "completed" ? "bg-green-100 text-green-800" :
                                    task.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {task.status === "completed" ? "Terminé" :
                                     task.status === "in-progress" ? "En cours" : "À faire"}
                                  </span>
                                </td>
                                <td className="py-3 px-4">{formatTime(task.timeSpent)}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center py-4 text-gray-500">
                              Aucune tâche trouvée pour cette période
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      <TaskForm
        open={isTaskModalOpen}
        onClose={closeTaskModal}
      />
    </div>
  );
};

export default Reports;
