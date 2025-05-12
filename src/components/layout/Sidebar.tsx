
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  HomeIcon,
  CalendarIcon,
  CheckSquareIcon,
  ListChecks,
  BarChart,
  ClockIcon,
  Settings,
  Plus,
  MenuIcon,
  X,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onNewTask: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewTask }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const closeSidebar = () => {
    setIsExpanded(false);
  };

  const navItems = [
    { path: "/dashboard", label: "Tableau de bord", icon: HomeIcon },
    { path: "/calendar", label: "Calendrier", icon: CalendarIcon },
    { path: "/tasks", label: "Tâches", icon: CheckSquareIcon },
    { path: "/projects", label: "Projets", icon: ListChecks },
    { path: "/members", label: "Membres", icon: Users },
    { path: "/reports", label: "Rapports", icon: BarChart },
    { path: "/time-tracking", label: "Chrono", icon: ClockIcon },
    { path: "/settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}
      
      {/* Mobile toggle button - visible only on small screens */}
      {isMobile && !isExpanded && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md shadow-md"
          aria-label="Ouvrir le menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      )}
      
      <aside
        className={`sidebar fixed top-0 left-0 h-full w-64 bg-sidebar-background text-sidebar-foreground shadow-lg transition-transform duration-300 ease-in-out z-50 ${
          isMobile
            ? isExpanded
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } sm:relative sm:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
            <span className="font-bold text-lg text-sidebar-primary">
              TimeTrek
            </span>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="sidebar-toggle text-sidebar-foreground focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>

          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul>
              {navItems.map((item) => (
                <li key={item.path} className="mb-1">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-md transition-colors hover:bg-sidebar-accent ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                          : "text-sidebar-foreground"
                      }`
                    }
                    onClick={closeSidebar}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="secondary"
              className="w-full justify-start mb-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90"
              onClick={onNewTask}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={logout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
