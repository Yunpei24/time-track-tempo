
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import TaskStats from "@/components/dashboard/TaskStats";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
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

  return (
    <div className="app-layout">
      <Sidebar onNewTask={openNewTaskModal} />

      <div className="main-content">
        <Header title="Tableau de bord" />
        
        <div className="page-content">
          <div className="max-w-7xl mx-auto">
            <TaskStats />
            
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tâches récentes</h2>
              <TaskList limit={5} onEditTask={handleEditTask} />
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
