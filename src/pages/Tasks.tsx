
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Task } from "@/contexts/TaskContext";

const Tasks: React.FC = () => {
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

  return (
    <div className="app-layout">
      <Sidebar onNewTask={openNewTaskModal} />
      
      <div className="main-content">
        <Header title="Tâches" />
        
        <div className="page-content">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Toutes les tâches</h1>
              <Button onClick={openNewTaskModal}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Nouvelle tâche
              </Button>
            </div>
            
            <TaskList onEditTask={handleEditTask} />
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

export default Tasks;
