
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TaskStats from "@/components/dashboard/TaskStats";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import TaskTimer from "@/components/tasks/TaskTimer";
import { useAuth } from "@/contexts/AuthContext";
import { Task } from "@/contexts/TaskContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  if (!user) {
    navigate("/");
    return null;
  }

  const openNewTaskModal = () => {
    setTaskToEdit(undefined);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(undefined);
  };

  // Get current date
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNewTask={openNewTaskModal} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Bonjour, {user.name}
              </h1>
              <div className="flex items-center text-sm text-gray-500 mt-2 md:mt-0">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{currentDate}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-2">
                <TaskStats userId={user.id} />
                
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tâches récentes</CardTitle>
                      <CardDescription>
                        Vos tâches en cours et à venir
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TaskList onEditTask={openEditTaskModal} />
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="col-span-1 space-y-6">
                <TaskTimer />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Conseil du jour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Pour améliorer votre productivité, essayez d'utiliser la technique Pomodoro : 25 minutes de travail concentré suivi de 5 minutes de pause.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
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
