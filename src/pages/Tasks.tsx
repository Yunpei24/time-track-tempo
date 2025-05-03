
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import TaskTimer from "@/components/tasks/TaskTimer";
import { useAuth } from "@/contexts/AuthContext";
import { Task } from "@/contexts/TaskContext";
import { Card, CardContent } from "@/components/ui/card";

const Tasks: React.FC = () => {
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNewTask={openNewTaskModal} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Tâches" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <TaskList onEditTask={openEditTaskModal} />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <TaskTimer />
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

export default Tasks;
