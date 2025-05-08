
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import { useTimer } from "@/contexts/TimerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClockIcon, PlayIcon, PauseIcon, StopCircleIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const TimeTracking: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tasks, addTimeToTask } = useTask();
  const { isRunning, isPaused, seconds, startTimer, pauseTimer, stopTimer } = useTimer();
  
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  
  const userTasks = tasks.filter(task => 
    task.assignedTo.includes(user?.id || "") && 
    task.status !== "completed"
  );

  if (!user) {
    navigate("/");
    return null;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (!selectedTaskId) {
      toast.error("Veuillez sélectionner une tâche");
      return;
    }
    
    startTimer(selectedTaskId);
    toast.success("Chronomètre démarré");
  };

  const handlePauseTimer = () => {
    pauseTimer();
    toast.info("Chronomètre en pause");
  };

  const handleStopTimer = () => {
    if (!selectedTaskId) {
      stopTimer();
      return;
    }
    
    // Convert elapsed time from seconds to minutes for storage
    const elapsedMinutes = Math.floor(seconds / 60);
    addTimeToTask(selectedTaskId, elapsedMinutes);
    stopTimer();
    
    toast.success(`${elapsedMinutes} minutes ajoutées à la tâche`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNewTask={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Chrono" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Suivi du temps
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Chronomètre
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Sélectionnez une tâche</label>
                    <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                      <SelectTrigger>
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
                  </div>
                  
                  <div className="flex flex-col items-center space-y-6">
                    <div className="text-6xl font-mono font-semibold py-6 animate-timer-pulse">
                      {formatTime(seconds)}
                    </div>
                    
                    <div className="flex space-x-4">
                      {!isRunning ? (
                        <Button 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={handleStartTimer}
                        >
                          <PlayIcon className="h-5 w-5 mr-2" />
                          Démarrer
                        </Button>
                      ) : (
                        <Button 
                          onClick={handlePauseTimer}
                          variant="outline"
                        >
                          <PauseIcon className="h-5 w-5 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button 
                        variant="destructive"
                        onClick={handleStopTimer}
                        disabled={!isRunning && !isPaused && seconds === 0}
                      >
                        <StopCircleIcon className="h-5 w-5 mr-2" />
                        Arrêter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Temps récent</CardTitle>
                </CardHeader>
                <CardContent>
                  {userTasks.length > 0 ? (
                    <div className="space-y-4">
                      {userTasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex justify-between items-center p-3 border-b">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {task.timeSpent} minutes enregistrées
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Estimé: {task.timeEstimate} min</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round((task.timeSpent / task.timeEstimate) * 100)}% complété
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucune tâche assignée
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TimeTracking;
