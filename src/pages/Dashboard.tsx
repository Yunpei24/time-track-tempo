
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import TaskStats from "@/components/dashboard/TaskStats";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import TaskTimer from "@/components/tasks/TaskTimer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";
import { Task } from "@/contexts/TaskContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

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

  const getTipOfTheDay = () => {
    const tips = [
      "Utilisez la méthode Pomodoro: travaillez 25 minutes puis faites une pause de 5 minutes.",
      "Planifiez vos tâches prioritaires en début de journée quand vous êtes le plus productif.",
      "Pour les projets complexes, décomposez-les en petites tâches gérables.",
      "N'oubliez pas de documenter régulièrement votre progression sur les projets.",
      "Utilisez des étiquettes de couleur pour distinguer rapidement les différents types de tâches."
    ];
    
    // Get a random tip based on the date (same tip for the whole day)
    const today = new Date().toISOString().split('T')[0]; 
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return tips[seed % tips.length];
  };

  return (
    <div className="app-layout">
      <Sidebar onNewTask={openNewTaskModal} />

      <div className="main-content">
        <Header title="Tableau de bord" />
        
        <div className="page-content">
          <div className="max-w-7xl mx-auto">
            <TaskStats userId={user.id} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Tâches récentes - 2/3 width */}
              <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Tâches récentes</h2>
                  <TaskList onEditTask={handleEditTask} />
                </div>
              </div>
              
              {/* Sidebar section - 1/3 width */}
              <div className="space-y-6">
                {/* Chronomètre */}
                <TaskTimer />
                
                {/* Astuce du jour */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <LightbulbIcon className="h-5 w-5 mr-2 text-yellow-400" />
                      Astuce du jour
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{getTipOfTheDay()}</p>
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
