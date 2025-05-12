
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import TaskStats from "@/components/dashboard/TaskStats";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import { Task } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PlayIcon, SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { useTask } from "@/contexts/TaskContext";
import { useTimer } from "@/contexts/TimerContext";
import ProjectTimeDistribution from "@/components/dashboard/ProjectTimeDistribution";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tasks } = useTask();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const { isRunning, seconds, startTimer, stopTimer } = useTimer();
  
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentDate);
  
  const userTasks = tasks.filter(task => 
    task.assignedTo.includes(user?.id || "") && 
    task.status !== "completed"
  );

  if (!user) {
    navigate("/");
    return null;
  }

  const openNewTaskModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartTimer = () => {
    if (selectedTaskId) {
      startTimer(selectedTaskId);
    }
  };
  
  const handleStopTimer = () => {
    stopTimer();
  };

  return (
    <div className="app-layout">
      <Sidebar onNewTask={openNewTaskModal} />

      <div className="main-content">
        <Header title="Dashboard" />
        
        <div className="page-content">
          <div className="max-w-7xl mx-auto">
            {/* Greeting and date */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Bonjour, {user.name}</h1>
              <div className="text-sm text-gray-500 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formattedDate}
              </div>
            </div>
            
            {/* Task stats */}
            <TaskStats userId={user.id} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2 space-y-6">
                {/* Task distribution section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition du temps par projet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectTimeDistribution userId={user.id} />
                  </CardContent>
                </Card>

                {/* Recent tasks section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tâches récentes</CardTitle>
                    <p className="text-sm text-muted-foreground">Vos tâches en cours et à venir</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 mt-2">
                      <h3 className="font-medium mb-2">Mes tâches</h3>
                      <div className="flex justify-between mb-2">
                        <div className="flex space-x-1">
                          {/* Filter buttons would go here */}
                        </div>
                        <div className="flex space-x-2">
                          <Select defaultValue="all-projects">
                            <SelectTrigger className="h-8 text-xs w-40">
                              <SelectValue placeholder="Tous les projets" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all-projects">Tous les projets</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select defaultValue="all-status">
                            <SelectTrigger className="h-8 text-xs w-40">
                              <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all-status">Tous les statuts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <TaskList onEditTask={handleEditTask} />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                {/* Chronometer section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chronomètre</CardTitle>
                    <p className="text-sm text-muted-foreground">Suivez le temps passé sur vos tâches</p>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full border-4 border-gray-100 flex items-center justify-center mb-4">
                      <div className="text-2xl font-mono font-bold">
                        {formatTime(seconds)}
                      </div>
                    </div>
                    
                    <Select 
                      value={selectedTaskId} 
                      onValueChange={setSelectedTaskId}
                    >
                      <SelectTrigger className="mb-4 w-full">
                        <SelectValue placeholder="Sélectionner une tâche" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTasks.map(task => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {!isRunning ? (
                        <Button 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={handleStartTimer}
                        >
                          <PlayIcon className="h-4 w-4 mr-2" />
                          Commencer
                        </Button>
                      ) : null}
                      {isRunning ? (
                        <Button 
                          variant="destructive"
                          onClick={handleStopTimer}
                          className="bg-red-400 hover:bg-red-500"
                        >
                          <SquareIcon className="h-4 w-4 mr-2" />
                          Arrêter
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tip of the day */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conseil du jour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Pour améliorer votre productivité, essayez d'utiliser la technique Pomodoro : 25 minutes de travail concentré suivi de 5 minutes de pause.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TaskForm
        task={taskToEdit}
        open={isTaskModalOpen}
        onClose={closeTaskModal}
      />
    </div>
  );
};

export default Dashboard;
