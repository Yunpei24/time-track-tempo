
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ProjectList from "@/components/projects/ProjectList";
import ProjectForm from "@/components/projects/ProjectForm";
import TaskForm from "@/components/tasks/TaskForm";
import { useAuth } from "@/contexts/AuthContext";
import { Project } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Projects: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(undefined);
  const isMobile = useIsMobile();

  if (!user) {
    navigate("/");
    return null;
  }

  const isManager = user.role === "manager";

  const openNewProjectModal = () => {
    setProjectToEdit(undefined);
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setProjectToEdit(undefined);
  };

  const openNewTaskModal = () => {
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar onNewTask={openNewTaskModal} />
      
      <div className="main-content">
        <Header title="Projets" />
        
        <div className="page-content">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Tous les projets
              </h1>
              {isManager && (
                <Button onClick={openNewProjectModal} size={isMobile ? "sm" : "default"}>
                  <PlusIcon className="h-4 w-4 mr-1 sm:mr-2" />
                  {isMobile ? "Nouveau" : "Nouveau projet"}
                </Button>
              )}
            </div>
            
            <ProjectList onEditProject={openEditProjectModal} />
          </div>
        </div>
      </div>
      
      <ProjectForm
        project={projectToEdit}
        open={isProjectModalOpen}
        onClose={closeProjectModal}
      />
      
      <TaskForm
        open={isTaskModalOpen}
        onClose={closeTaskModal}
      />
    </div>
  );
};

export default Projects;
